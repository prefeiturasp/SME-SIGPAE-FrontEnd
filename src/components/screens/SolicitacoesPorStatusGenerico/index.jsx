import React, { useEffect, useState } from "react";
import HTTP_STATUS from "http-status-codes";
import {
  agregarDefault,
  converterDDMMYYYYparaYYYYMMDD,
  getError,
  usuarioEhDRE,
  usuarioEhEmpresaTerceirizada,
  usuarioEhQualquerCODAE,
} from "helpers/utilities";
import { Spin } from "antd";
import CardListarSolicitacoes from "components/Shareable/CardListarSolicitacoes";
import { ajustarFormatoLog } from "../helper";
import { Paginacao } from "components/Shareable/Paginacao";
import { Field, Form } from "react-final-form";
import InputText from "components/Shareable/Input/InputText";
import { OnChange } from "react-final-form-listeners";
import Select from "components/Shareable/Select";
import { connect } from "react-redux";
import { PERIODOS_OPTIONS, TIPOS_SOLICITACOES_OPTIONS } from "constants/shared";
import { InputComData } from "components/Shareable/DatePicker";
import { resetCamposAlimentacao } from "reducers/filtersAlimentacaoReducer";
import { getDiretoriaregionalSimplissimaAxios } from "services/diretoriaRegional.service";
import { getLotesSimples } from "services/lote.service";
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
      params.data_evento = converterDDMMYYYYparaYYYYMMDD(params.data_evento);
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
      params["data_evento"] = converterDDMMYYYYparaYYYYMMDD(values.data_evento);
    }
    setTimeout(async () => {
      await getSolicitacoesAsync(params);
      setCurrentPage(page);
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
    const response = await getDiretoriaregionalSimplissimaAxios();
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
                {({ handleSubmit, values }) => (
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-3">
                        <Field
                          component={Select}
                          name="periodo"
                          naoDesabilitarPrimeiraOpcao
                          placeholder="Período"
                          initialValue={PERIODOS_OPTIONS[0].uuid}
                          options={PERIODOS_OPTIONS}
                        />
                      </div>
                      <OnChange name="periodo">
                        {(value) => {
                          getSolicitacoesAsync({
                            lote: values.lote,
                            status: values.status,
                            busca:
                              values.titulo && values.titulo.length > 2
                                ? values.titulo
                                : null,
                            tipo_solicitacao: values.tipo_solicitacao,
                            data_evento: values.data_evento,
                            periodo: value,
                            diretoria_regional: values.diretoria_regional,
                            ...PARAMS,
                          });
                          setCurrentPage(1);
                        }}
                      </OnChange>
                      <div className="ver-mais-titulo col-3">
                        <Field
                          component={InputText}
                          name="titulo"
                          placeholder="Pesquisar"
                          disabled={props.disabled}
                          initialValue={propsAlimentacaoRedux.tituloAlimentacao}
                        />
                        <div className="warning-num-charac">
                          * mínimo de 3 caracteres
                        </div>
                        <OnChange name="titulo">
                          {(value) => {
                            clearTimeout(typingTimeout);
                            typingTimeout = setTimeout(async () => {
                              getSolicitacoesAsync({
                                busca: value && value.length > 2 ? value : null,
                                status: values.status,
                                periodo: values.periodo,
                                lote: values.lote,
                                tipo_solicitacao: values.tipo_solicitacao,
                                data_evento: values.data_evento,
                                diretoria_regional: values.diretoria_regional,
                                ...PARAMS,
                              });
                              setCurrentPage(1);
                            }, 1000);
                          }}
                        </OnChange>
                      </div>
                      {listaStatus && (
                        <div className="col-3">
                          <Field
                            component={Select}
                            options={listaStatus}
                            name="status"
                            placeholder="Conferência Status"
                            naoDesabilitarPrimeiraOpcao
                            initialValue={
                              propsAlimentacaoRedux.statusAlimentacao
                            }
                          />
                          <OnChange name="status">
                            {(value) => {
                              getSolicitacoesAsync({
                                status: value,
                                lote: values.lote,
                                busca:
                                  values.titulo && values.titulo.length > 2
                                    ? values.titulo
                                    : null,
                                periodo: values.periodo,
                                tipo_solicitacao: values.tipo_solicitacao,
                                data_evento: values.data_evento,
                                diretoria_regional: values.diretoria_regional,
                                ...PARAMS,
                              });
                              setCurrentPage(1);
                            }}
                          </OnChange>
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
                          options={TIPOS_SOLICITACOES_OPTIONS}
                        />
                        <OnChange name="tipo_solicitacao">
                          {(value) => {
                            getSolicitacoesAsync({
                              lote: values.lote,
                              status: values.status,
                              busca:
                                values.titulo && values.titulo.length > 2
                                  ? values.titulo
                                  : null,
                              tipo_solicitacao: value,
                              periodo: values.periodo,
                              data_evento: values.data_evento,
                              diretoria_regional: values.diretoria_regional,
                              ...PARAMS,
                            });
                            setCurrentPage(1);
                          }}
                        </OnChange>
                      </div>

                      <div className="col-3">
                        <Field
                          name="data_evento"
                          minDate={null}
                          component={InputComData}
                          initialValue={
                            propsAlimentacaoRedux.dataEventoAlimentacao
                          }
                          placeholder="Data do evento"
                        />
                        <OnChange name="data_evento">
                          {(value) => {
                            getSolicitacoesAsync({
                              lote: values.lote,
                              status: values.status,
                              busca:
                                values.titulo && values.titulo.length > 2
                                  ? values.titulo
                                  : null,
                              tipo_solicitacao: values.tipo_solicitacao,
                              data_evento: value,
                              periodo: values.periodo,
                              diretoria_regional: values.diretoria_regional,
                              ...PARAMS,
                            });
                            setCurrentPage(1);
                          }}
                        </OnChange>
                      </div>
                      {ehCODAE && (
                        <div className="offset-6 col-3">
                          <Field
                            component={Select}
                            options={opcoesDRE}
                            name="diretoria_regional"
                            placeholder="Filtrar por DRE"
                            initialValue={propsAlimentacaoRedux.dreAlimentacao}
                            naoDesabilitarPrimeiraOpcao
                          />
                          <OnChange name="diretoria_regional">
                            {(value) => {
                              getSolicitacoesAsync({
                                lote: values.lote,
                                status: values.status,
                                busca:
                                  values.titulo && values.titulo.length > 2
                                    ? values.titulo
                                    : null,
                                tipo_solicitacao: values.tipo_solicitacao,
                                data_evento: values.data_evento,
                                periodo: values.periodo,
                                diretoria_regional: value,
                                ...PARAMS,
                              });
                              setCurrentPage(1);
                            }}
                          </OnChange>
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
                              naoDesabilitarPrimeiraOpcao
                            />
                            <OnChange name="lote">
                              {(value) => {
                                getSolicitacoesAsync({
                                  lote: value,
                                  status: values.status,
                                  busca:
                                    values.titulo && values.titulo.length > 2
                                      ? values.titulo
                                      : null,
                                  tipo_solicitacao: values.tipo_solicitacao,
                                  data_evento: values.data_evento,
                                  periodo: values.periodo,
                                  diretoria_regional: values.diretoria_regional,
                                  ...PARAMS,
                                });
                                setCurrentPage(1);
                              }}
                            </OnChange>
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
