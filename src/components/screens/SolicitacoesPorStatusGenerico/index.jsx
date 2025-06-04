import React, { useEffect, useState } from "react";
import HTTP_STATUS from "http-status-codes";
import {
  agregarDefault,
  converterDDMMYYYYparaYYYYMMDD,
  getError,
  usuarioEhDRE,
  usuarioEhEmpresaTerceirizada,
  usuarioEhQualquerCODAE,
} from "src/helpers/utilities";
import { Spin } from "antd";
import CardListarSolicitacoes from "src/components/Shareable/CardListarSolicitacoes";
import { ajustarFormatoLog } from "../helper";
import { Paginacao } from "src/components/Shareable/Paginacao";
import { Field, Form } from "react-final-form";
import InputText from "src/components/Shareable/Input/InputText";
import Select from "src/components/Shareable/Select";
import { connect } from "react-redux";
import {
  PERIODOS_OPTIONS,
  TIPOS_SOLICITACOES_OPTIONS,
} from "src/constants/shared";
import { InputComData } from "src/components/Shareable/DatePicker";
import { resetCamposAlimentacao } from "src/reducers/filtersAlimentacaoReducer";
import { getDiretoriaregionalSimplissima } from "src/services/diretoriaRegional.service";
import { getLotesSimples } from "src/services/lote.service";
import "./style.scss";

function SolicitacoesPorStatusGenerico(props) {
  const {
    titulo,
    tipoCard,
    icone,
    getSolicitacoes,
    Legendas,
    tipoPaginacao,
    limit,
    lotes,
    listaStatus,
  } = props;

  const [solicitacoes, setSolicitacoes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [erro, setErro] = useState("");
  const [propsAlimentacaoRedux, setPropsAlimentacaoRedux] = useState({});
  const [filtroInicial, setFiltroInicial] = useState(false);
  const [opcoesDRE, setOpcoesDRE] = useState(null);
  const [opcoesLotes, setOpcoesLotes] = useState(null);

  const ehTerceirizada = usuarioEhEmpresaTerceirizada();
  const ehDRE = usuarioEhDRE();
  const ehCODAE = usuarioEhQualquerCODAE();

  const PAGE_SIZE = limit || 100;
  const TIPO_PAGINACAO = tipoPaginacao || "OFFSET";
  const PARAMS = TIPO_PAGINACAO
    ? { limit: PAGE_SIZE, offset: 0 }
    : { page: currentPage };

  const getSolicitacoesAsync = async (params = null) => {
    if (params.data_evento) {
      params.data_evento = params.data_evento.includes("/")
        ? converterDDMMYYYYparaYYYYMMDD(params.data_evento)
        : params.data_evento;
    }
    if (params.titulo) {
      params.busca = params.titulo;
    }
    const response = await getSolicitacoes(params || PARAMS);
    if (response.status === HTTP_STATUS.OK) {
      setSolicitacoes(ajustarFormatoLog(response.data.results));
      setCount(response.data.count);
      setLoading(false);
    } else {
      setErro(getError(response.data));
      setLoading(false);
    }
  };

  const onSubmit = async () => {};

  const onPageChanged = async (page, values) => {
    const params = TIPO_PAGINACAO
      ? { limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE }
      : { page };
    if (values.periodo) {
      params["periodo"] = values.periodo;
    }
    if (values.titulo && values.titulo.length > 2) {
      params["busca"] = values.titulo;
    }
    if (values.status) {
      params["status"] = values.status;
    }
    if (values.lote) {
      params["lote"] = values.lote;
    }
    if (values.tipo_solicitacao) {
      params["tipo_solicitacao"] = values.tipo_solicitacao;
    }
    if (values.data_evento) {
      params["data_evento"] = values.data_evento.includes("/")
        ? converterDDMMYYYYparaYYYYMMDD(values.data_evento)
        : values.data_evento;
    }
    setLoading(true);
    setTimeout(async () => {
      await getSolicitacoesAsync(params);
      setCurrentPage(page);
      setLoading(false);
    }, 500);
  };

  const getLotesAsync = async () => {
    const response = await getLotesSimples();
    if (response.status === HTTP_STATUS.OK) {
      setOpcoesLotes(response.data.results);
    } else {
      setErro("Erro ao carregar lotes");
    }
  };

  const getDiretoriasRegionaisAsync = async () => {
    const response = await getDiretoriaregionalSimplissima();
    if (response.status === HTTP_STATUS.OK) {
      let resultados_dre = response.data.results;
      const opcoesDRE = resultados_dre.slice();
      opcoesDRE.unshift({ uuid: "", nome: "Filtrar por DRE" });
      setOpcoesDRE(opcoesDRE);
    } else {
      setErro("Erro ao carregar DREs");
    }
  };

  const filtragemInicial = () => {
    const propsAlimentacao = {
      tituloAlimentacao: props.tituloAlimentacao,
      loteAlimentacao: props.loteAlimentacao,
      statusAlimentacao: props.statusAlimentacao,
      tipoSolicitacaoAlimentacao: props.tipoSolicitacaoAlimentacao,
      dataEventoAlimentacao: props.dataEventoAlimentacao,
      dreAlimentacao: props.dreAlimentacao,
    };
    setPropsAlimentacaoRedux(propsAlimentacao);
    const values = {
      limit: 10,
      titulo: propsAlimentacao.tituloAlimentacao || "",
      lote: propsAlimentacao.loteAlimentacao || "",
      status: propsAlimentacao.statusAlimentacao || "",
      tipo_solicitacao: propsAlimentacao.tipoSolicitacaoAlimentacao || "",
      data_evento: propsAlimentacao.dataEventoAlimentacao || "",
      diretoria_regional: propsAlimentacao.dreAlimentacao || "",
      periodo: PERIODOS_OPTIONS[0].uuid,
    };
    props.resetCamposAlimentacao();
    getSolicitacoesAsync(values);
  };

  useEffect(() => {
    if (ehCODAE) {
      getDiretoriasRegionaisAsync();
      getLotesAsync();
    }
    if (ehDRE) {
      getLotesAsync();
    }

    if (!filtroInicial) {
      setFiltroInicial(true);
      filtragemInicial();
    } else {
      getSolicitacoesAsync();
    }
  }, []);

  let typingTimeout = null;

  return (
    <div className="card mt-3">
      <div className="card-body">
        {erro && <div>{erro}</div>}
        {!erro && (
          <Spin tip="Carregando..." spinning={loading}>
            {solicitacoes && (
              <Form onSubmit={onSubmit}>
                {({ form, handleSubmit, values }) => (
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-3">
                        <Field
                          component={Select}
                          name="periodo"
                          naoDesabilitarPrimeiraOpcao
                          placeholder="Período"
                          disabled={props.disabled || loading}
                          initialValue={PERIODOS_OPTIONS[0].uuid}
                          options={PERIODOS_OPTIONS}
                          onChangeEffect={async (e) => {
                            const value = e.target.value;
                            const values_ = form.getState().values;

                            setLoading(true);
                            await getSolicitacoesAsync({
                              lote: values_.lote,
                              status: values_.status,
                              busca:
                                values_.titulo && values_.titulo.length > 2
                                  ? values_.titulo
                                  : null,
                              tipo_solicitacao: values_.tipo_solicitacao,
                              data_evento: values_.data_evento,
                              periodo: value,
                              diretoria_regional: values_.diretoria_regional,
                              ...PARAMS,
                            });
                            setLoading(false);
                            setCurrentPage(1);
                          }}
                        />
                      </div>
                      <div className="ver-mais-titulo col-3">
                        <Field
                          component={InputText}
                          name="titulo"
                          placeholder="Pesquisar"
                          disabled={props.disabled || loading}
                          initialValue={propsAlimentacaoRedux.tituloAlimentacao}
                          inputOnChange={async (e) => {
                            const value = e.target.value;
                            const values_ = form.getState().values;

                            clearTimeout(typingTimeout);
                            typingTimeout = setTimeout(async () => {
                              setLoading(true);
                              await getSolicitacoesAsync({
                                busca: value && value.length > 2 ? value : null,
                                status: values_.status,
                                periodo: values_.periodo,
                                lote: values_.lote,
                                tipo_solicitacao: values_.tipo_solicitacao,
                                data_evento: values_.data_evento,
                                diretoria_regional: values_.diretoria_regional,
                                ...PARAMS,
                              });
                              setLoading(false);
                              setCurrentPage(1);
                            }, 1000);
                          }}
                        />
                        <div className="warning-num-charac">
                          * mínimo de 3 caracteres
                        </div>
                      </div>
                      {listaStatus && (
                        <div className="col-3">
                          <Field
                            component={Select}
                            options={listaStatus}
                            disabled={props.disabled || loading}
                            name="status"
                            placeholder="Conferência Status"
                            naoDesabilitarPrimeiraOpcao
                            initialValue={
                              propsAlimentacaoRedux.statusAlimentacao
                            }
                            onChangeEffect={async (e) => {
                              const value = e.target.value;
                              const values_ = form.getState().values;

                              setLoading(true);
                              await getSolicitacoesAsync({
                                status: value,
                                lote: values_.lote,
                                busca:
                                  values_.titulo && values_.titulo.length > 2
                                    ? values_.titulo
                                    : null,
                                periodo: values_.periodo,
                                tipo_solicitacao: values_.tipo_solicitacao,
                                data_evento: values_.data_evento,
                                diretoria_regional: values_.diretoria_regional,
                                ...PARAMS,
                              });
                              setLoading(false);
                              setCurrentPage(1);
                            }}
                          />
                        </div>
                      )}

                      <div className="col-3">
                        <Field
                          component={Select}
                          name="tipo_solicitacao"
                          naoDesabilitarPrimeiraOpcao
                          placeholder="Tipo de Solicitação"
                          initialValue={
                            propsAlimentacaoRedux.tipoSolicitacaoAlimentacao
                          }
                          disabled={props.disabled || loading}
                          options={TIPOS_SOLICITACOES_OPTIONS}
                          onChangeEffect={async (e) => {
                            const value = e.target.value;
                            const values_ = form.getState().values;

                            setLoading(true);
                            await getSolicitacoesAsync({
                              lote: values_.lote,
                              status: values_.status,
                              busca:
                                values_.titulo && values_.titulo.length > 2
                                  ? values_.titulo
                                  : null,
                              tipo_solicitacao: value,
                              periodo: values_.periodo,
                              data_evento: values_.data_evento,
                              diretoria_regional: values_.diretoria_regional,
                              ...PARAMS,
                            });
                            setLoading(false);
                            setCurrentPage(1);
                          }}
                        />
                      </div>

                      <div className="col-3">
                        <Field
                          name="data_evento"
                          minDate={null}
                          component={InputComData}
                          initialValue={
                            propsAlimentacaoRedux.dataEventoAlimentacao
                          }
                          disabled={props.disabled || loading}
                          placeholder="Data do evento"
                          inputOnChange={async (value) => {
                            const values_ = form.getState().values;

                            setLoading(true);
                            await getSolicitacoesAsync({
                              lote: values_.lote,
                              status: values_.status,
                              busca:
                                values_.titulo && values_.titulo.length > 2
                                  ? values_.titulo
                                  : null,
                              tipo_solicitacao: values_.tipo_solicitacao,
                              data_evento: value,
                              periodo: values_.periodo,
                              diretoria_regional: values_.diretoria_regional,
                              ...PARAMS,
                            });
                            setLoading(false);
                            setCurrentPage(1);
                          }}
                        />
                      </div>
                      {ehCODAE && (
                        <div className="offset-6 col-3">
                          <Field
                            component={Select}
                            options={opcoesDRE}
                            name="diretoria_regional"
                            placeholder="Filtrar por DRE"
                            initialValue={propsAlimentacaoRedux.dreAlimentacao}
                            disabled={props.disabled || loading}
                            naoDesabilitarPrimeiraOpcao
                            onChangeEffect={async (e) => {
                              const value = e.target.value;
                              const values_ = form.getState().values;

                              setLoading(true);
                              await getSolicitacoesAsync({
                                lote: values_.lote,
                                status: values_.status,
                                busca:
                                  values_.titulo && values_.titulo.length > 2
                                    ? values_.titulo
                                    : null,
                                tipo_solicitacao: values_.tipo_solicitacao,
                                data_evento: values_.data_evento,
                                periodo: values_.periodo,
                                diretoria_regional: value,
                                ...PARAMS,
                              });
                              setLoading(false);
                              setCurrentPage(1);
                            }}
                          />
                        </div>
                      )}

                      {(lotes || opcoesLotes) &&
                        (ehDRE || ehCODAE || ehTerceirizada) && (
                          <div className="col-3">
                            <Field
                              component={Select}
                              options={agregarDefault(
                                lotes || opcoesLotes,
                                "Lote"
                              )}
                              name="lote"
                              placeholder="Selecione um Lote"
                              initialValue={
                                propsAlimentacaoRedux.loteAlimentacao
                              }
                              disabled={props.disabled || loading}
                              naoDesabilitarPrimeiraOpcao
                              onChangeEffect={async (e) => {
                                const value = e.target.value;
                                const values_ = form.getState().values;

                                setLoading(true);
                                await getSolicitacoesAsync({
                                  lote: value,
                                  status: values_.status,
                                  busca:
                                    values_.titulo && values_.titulo.length > 2
                                      ? values_.titulo
                                      : null,
                                  tipo_solicitacao: values_.tipo_solicitacao,
                                  data_evento: values_.data_evento,
                                  periodo: values_.periodo,
                                  diretoria_regional:
                                    values_.diretoria_regional,
                                  ...PARAMS,
                                });
                                setLoading(false);
                                setCurrentPage(1);
                              }}
                            />
                          </div>
                        )}
                    </div>
                    <CardListarSolicitacoes
                      titulo={titulo}
                      solicitacoes={solicitacoes}
                      tipo={tipoCard}
                      icone={icone}
                    />
                    <Paginacao
                      onChange={(page) => onPageChanged(page, values)}
                      total={count}
                      pageSize={PAGE_SIZE}
                      current={currentPage}
                    />
                  </form>
                )}
              </Form>
            )}
            <Legendas />
          </Spin>
        )}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  const statusAlimentacao = state.filtersAlimentacao.statusAlimentacao;
  const loteAlimentacao = state.filtersAlimentacao.loteAlimentacao;
  const tituloAlimentacao = state.filtersAlimentacao.tituloAlimentacao;
  const tipoSolicitacaoAlimentacao =
    state.filtersAlimentacao.tipoSolicitacaoAlimentacao;
  const dataEventoAlimentacao = state.filtersAlimentacao.dataEventoAlimentacao;
  const dreAlimentacao = state.filtersAlimentacao.dreAlimentacao;
  return {
    statusAlimentacao: statusAlimentacao,
    loteAlimentacao: loteAlimentacao,
    tituloAlimentacao: tituloAlimentacao,
    tipoSolicitacaoAlimentacao: tipoSolicitacaoAlimentacao,
    dataEventoAlimentacao: dataEventoAlimentacao,
    dreAlimentacao: dreAlimentacao,
  };
};

const mapDispatchToProps = (dispatch) => ({
  resetCamposAlimentacao: () => {
    dispatch(resetCamposAlimentacao());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SolicitacoesPorStatusGenerico);
