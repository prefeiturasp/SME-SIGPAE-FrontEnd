import StatefulMultiSelect from "@khanacademy/react-multi-select";
import moment from "moment";
import Select from "components/Shareable/Select";
import HTTP_STATUS from "http-status-codes";
import { required } from "helpers/fieldValidators";
import {
  agregarDefault,
  deepCopy,
  usuarioEhDRE,
  usuarioEhTerceirizada
} from "helpers/utilities";
import React, { useState } from "react";
import { useEffect } from "react";
import { Field, Form } from "react-final-form";
import { getLotesSimples } from "services/lote.service";
import { Spin } from "antd";
import { lotesToOptions } from "../../helpers";
import "../../style.scss";
import { getTiposUnidadeEscolar } from "services/cadastroTipoAlimentacao.service";
import { STATUS_SOLICITACOES, TIPOS_SOLICITACAO } from "../../constants";
import { getEscolasTrecTotal } from "services/escola.service";
import { InputComData } from "components/Shareable/DatePicker";
import { getNomesTerceirizadas } from "services/produto.service";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE
} from "components/Shareable/Botao/constants";
import { OnChange } from "react-final-form-listeners";
import { toastError } from "components/Shareable/Toast/dialogs";

export const Filtros = ({ ...props }) => {
  const [lotes, setLotes] = useState([]);
  const [tiposUnidades, setTiposUnidades] = useState([]);
  const [unidadesEducacionais, setUnidadesEducacionais] = useState([]);
  const [terceirizadas, setTerceirizadas] = useState([]);

  const {
    erroAPI,
    meusDados,
    setErroAPI,
    setSolicitacoes,
    setTotalBusca,
    setPage,
    setFiltros,
    endpoint,
    getSolicitacoesDetalhadasAsync,
    setCarregando,
    setResultadoPaginado
  } = props;

  const getLotesSimplesAsync = async () => {
    let params = {};
    if (usuarioEhDRE()) {
      params["diretoria_regional__uuid"] =
        meusDados.vinculo_atual.instituicao.uuid;
    }
    if (usuarioEhTerceirizada()) {
      params["terceirizada__uuid"] = meusDados.vinculo_atual.instituicao.uuid;
    }
    const response = await getLotesSimples(params);
    if (response.status === HTTP_STATUS.OK) {
      setLotes(lotesToOptions(response.data.results));
    } else {
      setErroAPI("Erro ao carregar lotes.");
    }
  };

  const getTiposUnidadeEscolarAsync = async () => {
    const response = await getTiposUnidadeEscolar({
      pertence_relatorio_solicitacoes_alimentacao: true
    });
    if (response.status === HTTP_STATUS.OK) {
      setTiposUnidades(response.data.results);
    } else {
      setErroAPI("Erro ao carregar tipos de unidades.");
    }
  };

  const getEscolasSimplissimaComDREUnpaginatedAsync = async () => {
    let params = null;
    if (usuarioEhDRE()) {
      params = { dre: meusDados.vinculo_atual.instituicao.uuid };
    }
    if (usuarioEhTerceirizada()) {
      params = { terceirizada: meusDados.vinculo_atual.instituicao.uuid };
    }
    const response = await getEscolasTrecTotal(params);
    if (response.status === HTTP_STATUS.OK) {
      setUnidadesEducacionais(response.data);
    } else {
      setErroAPI("Erro ao carregar unidades educacionais.");
    }
  };

  const getTerceirizadasAsync = async () => {
    let params = {};
    if (usuarioEhDRE()) {
      params["dre_uuid"] = meusDados.vinculo_atual.instituicao.uuid;
    }
    const response = await getNomesTerceirizadas(params);
    if (response.status === HTTP_STATUS.OK) {
      setTerceirizadas(response.data.results);
    } else {
      setErroAPI("Erro ao carregar terceirizadas.");
    }
  };

  useEffect(() => {
    getLotesSimplesAsync();
    getTiposUnidadeEscolarAsync();
    getEscolasSimplissimaComDREUnpaginatedAsync();
    getTerceirizadasAsync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtroEscolas = (unidadesEducacionais, values) => {
    if (values.lotes && values.lotes.length > 0) {
      unidadesEducacionais = unidadesEducacionais.filter(ue =>
        values.lotes.includes(ue.lote)
      );
    }
    if (values.tipos_unidade && values.tipos_unidade.length > 0) {
      unidadesEducacionais = unidadesEducacionais.filter(ue =>
        values.tipos_unidade.includes(ue.tipo_unidade)
      );
    }
    return unidadesEducacionais.map(unidadeEducacional => ({
      label: unidadeEducacional.nome,
      value: unidadeEducacional.uuid
    }));
  };

  const onSubmit = async values => {
    setCarregando(true);
    let _values = deepCopy(values);
    setFiltros(values);
    const page = 1;
    _values["limit"] = 10;
    _values["offset"] = (page - 1) * _values["limit"];
    setPage(1);

    const response = await endpoint(_values);
    if (response.status === HTTP_STATUS.OK) {
      setResultadoPaginado(response.data.results);
      setTotalBusca(response.data.count);
      await getSolicitacoesDetalhadasAsync(response.data.results);
    } else {
      toastError(
        "Houve um erro ao filtrar solicitações, tente novamente mais tarde"
      );
    }
    setCarregando(false);
  };

  const LOADING =
    !lotes.length ||
    !tiposUnidades.length ||
    !unidadesEducacionais.length ||
    !terceirizadas.length;

  return (
    <Spin tip="Carregando..." spinning={LOADING && !erroAPI}>
      {!erroAPI && (
        <Form onSubmit={onSubmit}>
          {({ form, handleSubmit, values }) => (
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-lg-3 col-xl-4">
                  <Field
                    component={Select}
                    name="status"
                    label="Status da Solicitação"
                    options={agregarDefault(STATUS_SOLICITACOES)}
                    required
                    validate={required}
                    naoDesabilitarPrimeiraOpcao
                  />
                  <OnChange name="status">
                    {async value => {
                      if (value) {
                        form.reset();
                        form.change("status", value);
                      }
                    }}
                  </OnChange>
                </div>
                <div className="col-4">
                  <label>Lote</label>
                  <Field
                    component={StatefulMultiSelect}
                    name="lotes"
                    selected={values.lotes || []}
                    options={lotes}
                    onSelectedChanged={values_ => form.change(`lotes`, values_)}
                    hasSelectAll
                    overrideStrings={{
                      selectSomeItems: "Selecione",
                      allItemsAreSelected: "Todos os lotes",
                      selectAll: "Todos"
                    }}
                    disabled={!values.status}
                  />
                </div>
                <div className="col-lg-5 col-xl-4">
                  <label>Tipo de Solicitação</label>
                  <Field
                    component={StatefulMultiSelect}
                    name="tipos_solicitacao"
                    selected={values.tipos_solicitacao || []}
                    options={TIPOS_SOLICITACAO}
                    onSelectedChanged={values_ =>
                      form.change(`tipos_solicitacao`, values_)
                    }
                    hasSelectAll
                    overrideStrings={{
                      selectSomeItems: "Selecione",
                      allItemsAreSelected: "Todos os tipos de alimentação",
                      selectAll: "Todos"
                    }}
                    disabled={!values.status}
                  />
                </div>
              </div>
              {values.status !== "EM_ANDAMENTO" && (
                <div className="row mt-3">
                  <div className="col-4">
                    <label>Tipo de Unidade</label>
                    <Field
                      component={StatefulMultiSelect}
                      name="tipos_unidade"
                      selected={values.tipos_unidade || []}
                      options={tiposUnidades.map(tipoUnidade => ({
                        label: tipoUnidade.iniciais,
                        value: tipoUnidade.uuid
                      }))}
                      onSelectedChanged={values_ =>
                        form.change(`tipos_unidade`, values_)
                      }
                      hasSelectAll
                      overrideStrings={{
                        selectSomeItems: "Selecione",
                        allItemsAreSelected: "Todos os tipos de unidade",
                        selectAll: "Todos"
                      }}
                      disabled={!values.status}
                    />
                  </div>
                  <div className="col-8">
                    <label>Unidades Educacionais</label>
                    <Field
                      component={StatefulMultiSelect}
                      name="unidades_educacionais"
                      selected={values.unidades_educacionais || []}
                      options={filtroEscolas(unidadesEducacionais, values)}
                      onSelectedChanged={values_ =>
                        form.change(`unidades_educacionais`, values_)
                      }
                      hasSelectAll
                      overrideStrings={{
                        selectSomeItems: "Selecione",
                        allItemsAreSelected: "Todos os tipos de unidade",
                        selectAll: "Todos"
                      }}
                      disabled={!values.status}
                    />
                  </div>
                </div>
              )}
              <div className="row mt-3">
                {values.status === "EM_ANDAMENTO" && (
                  <div className="col-6">
                    <Field
                      component={Select}
                      label="Terceirizada"
                      name="terceirizada"
                      options={agregarDefault(
                        terceirizadas.map(terceirizada => ({
                          nome: terceirizada.nome_fantasia,
                          uuid: terceirizada.uuid
                        }))
                      )}
                      naoDesabilitarPrimeiraOpcao
                    />
                  </div>
                )}
                <div className="col-6">
                  <div>
                    <label>Período do Evento</label>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <Field
                        component={InputComData}
                        placeholder="De"
                        minDate={null}
                        maxDate={null}
                        name="de"
                        disabled={!values.status}
                      />
                    </div>
                    <div className="col-6">
                      <Field
                        component={InputComData}
                        placeholder="Até"
                        minDate={moment(values.de, "DD/MM/YYYY")._d}
                        maxDate={null}
                        name="ate"
                        disabled={!values.status}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-12 text-right">
                  <Botao
                    texto="Limpar Filtros"
                    type={BUTTON_TYPE.BUTTON}
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    onClick={() => {
                      form.reset();
                      setFiltros(undefined);
                      setTotalBusca(undefined);
                      setSolicitacoes(undefined);
                      setResultadoPaginado(undefined);
                      setPage(1);
                    }}
                  />
                  <Botao
                    texto="Consultar"
                    type={BUTTON_TYPE.SUBMIT}
                    style={BUTTON_STYLE.GREEN}
                    className="ml-3"
                  />
                </div>
              </div>
            </form>
          )}
        </Form>
      )}
    </Spin>
  );
};
