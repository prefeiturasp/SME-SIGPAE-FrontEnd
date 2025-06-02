import StatefulMultiSelect from "@khanacademy/react-multi-select";
import { Spin } from "antd";
import CollapseFiltros from "src/components/Shareable/CollapseFiltros";
import { InputComData } from "src/components/Shareable/DatePicker";
import Select from "src/components/Shareable/Select";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { required } from "src/helpers/fieldValidators";
import {
  agregarDefault,
  deepCopy,
  usuarioEhDRE,
  usuarioEhEmpresaTerceirizada,
  usuarioEhEscolaTerceirizadaQualquerPerfil,
} from "src/helpers/utilities";
import HTTP_STATUS from "http-status-codes";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Field } from "react-final-form";
import { getTiposUnidadeEscolar } from "src/services/cadastroTipoAlimentacao.service";
import {
  getEscolaSimples,
  getEscolasTercTotal,
} from "src/services/escola.service";
import { getLotesSimples } from "src/services/lote.service";
import { getNomesTerceirizadas } from "src/services/produto.service";
import { getTotalizadoresRelatorioSolicitacoes } from "src/services/relatorios.service";
import { STATUS_SOLICITACOES, TIPOS_SOLICITACAO } from "../../constants";
import { lotesToOptions } from "../../helpers";
import "../../style.scss";

export const Filtros = ({ ...props }) => {
  const [lotes, setLotes] = useState([]);
  const [tiposUnidades, setTiposUnidades] = useState([]);
  const [unidadesEducacionais, setUnidadesEducacionais] = useState([]);
  const [terceirizadas, setTerceirizadas] = useState([]);
  const [unidadeEducacional, setUnidadeEducacional] = useState(null);

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
    setResultadoPaginado,
    setTotalizadores,
    setRenderGraficosOuTabela,
  } = props;

  const getLotesSimplesAsync = async () => {
    let params = {};
    if (usuarioEhDRE()) {
      params["diretoria_regional__uuid"] =
        meusDados.vinculo_atual.instituicao.uuid;
    }
    if (usuarioEhEmpresaTerceirizada()) {
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
      pertence_relatorio_solicitacoes_alimentacao: true,
    });
    if (response.status === HTTP_STATUS.OK) {
      setTiposUnidades(response.data.results);
    } else {
      setErroAPI("Erro ao carregar tipos de unidades.");
    }
  };

  const getEscolasSimplissimaComDREUnpaginatedAsync = async () => {
    let params = null;
    if (usuarioEhEscolaTerceirizadaQualquerPerfil()) {
      params = { escola: meusDados.vinculo_atual.instituicao.uuid };
    } else if (usuarioEhDRE()) {
      params = { dre: meusDados.vinculo_atual.instituicao.uuid };
    } else if (usuarioEhEmpresaTerceirizada()) {
      params = { terceirizada: meusDados.vinculo_atual.instituicao.uuid };
    }
    const response = await getEscolasTercTotal(params);
    if (response.status === HTTP_STATUS.OK) {
      setUnidadesEducacionais(response.data);
    } else {
      setErroAPI("Erro ao carregar unidades educacionais.");
    }
  };

  const getEscolaSimplesAsync = async () => {
    let uuidEscola = meusDados.vinculo_atual.instituicao.uuid;
    const response = await getEscolaSimples(uuidEscola);
    if (response.status === HTTP_STATUS.OK) {
      let unidadeEducacional = response.data;
      setUnidadeEducacional(unidadeEducacional);
    } else {
      setErroAPI("Erro ao carregar unidade educacional.");
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

  const getTotalizadoresAsync = async (values) => {
    const response = await getTotalizadoresRelatorioSolicitacoes(values);
    if (response.status === HTTP_STATUS.OK) {
      setTotalizadores(response.data.results);
    } else {
      setErroAPI("Erro ao carregar totalizadores. Tente novamente mais tarde.");
    }
  };

  useEffect(() => {
    Promise.all([
      getLotesSimplesAsync(),
      getTiposUnidadeEscolarAsync(),
      getEscolasSimplissimaComDREUnpaginatedAsync(),
      getTerceirizadasAsync(),
    ]);

    if (usuarioEhEscolaTerceirizadaQualquerPerfil()) {
      getEscolaSimplesAsync();
    }
  }, []);

  const filtroEscolas = (unidadesEducacionais, values) => {
    if (values.lotes && values.lotes.length > 0) {
      unidadesEducacionais = unidadesEducacionais.filter((ue) =>
        values.lotes.includes(ue.lote)
      );
    }
    if (values.tipos_unidade && values.tipos_unidade.length > 0) {
      unidadesEducacionais = unidadesEducacionais.filter((ue) =>
        values.tipos_unidade.includes(ue.tipo_unidade)
      );
    }
    return unidadesEducacionais.map((unidadeEducacional) => ({
      label: unidadeEducacional.nome,
      value: unidadeEducacional.uuid,
    }));
  };

  const onSubmit = async (values) => {
    setCarregando(true);
    let _values = deepCopy(values);
    setFiltros(values);

    const page = 1;
    _values["limit"] = 10;
    _values["offset"] = (page - 1) * _values["limit"];
    setPage(1);

    setRenderGraficosOuTabela("Gráficos");

    const response = await endpoint(_values);
    await getTotalizadoresAsync(_values);

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
        <CollapseFiltros
          onSubmit={onSubmit}
          onClear={() => {
            setFiltros(undefined);
            setTotalBusca(undefined);
            setSolicitacoes(undefined);
            setResultadoPaginado(undefined);
            setPage(1);
          }}
          titulo="Filtrar Resultados"
        >
          {(values, form) => (
            <>
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
                    onChangeEffect={async (e) => {
                      const value = e.target.value;

                      if (value) {
                        form.reset();
                        form.change("status", value);
                      }
                    }}
                  />
                </div>
                <div className="col-4">
                  <label>Lote</label>
                  <Field
                    component={StatefulMultiSelect}
                    name="lotes"
                    selected={
                      values.lotes ||
                      (unidadeEducacional &&
                        unidadeEducacional.lote && [
                          unidadeEducacional.lote.uuid,
                        ]) ||
                      []
                    }
                    options={lotes}
                    onSelectedChanged={(values_) =>
                      form.change(`lotes`, values_)
                    }
                    hasSelectAll
                    overrideStrings={{
                      selectSomeItems: "Selecione",
                      allItemsAreSelected: "Todos os lotes",
                      selectAll: "Todos",
                    }}
                    disabled={!values.status || unidadeEducacional}
                  />
                </div>
                <div className="col-lg-5 col-xl-4">
                  <label>Tipo de Solicitação</label>
                  <Field
                    component={StatefulMultiSelect}
                    name="tipos_solicitacao"
                    selected={values.tipos_solicitacao || []}
                    options={TIPOS_SOLICITACAO}
                    onSelectedChanged={(values_) =>
                      form.change(`tipos_solicitacao`, values_)
                    }
                    hasSelectAll
                    overrideStrings={{
                      selectSomeItems: "Selecione",
                      allItemsAreSelected: "Todos os tipos de alimentação",
                      selectAll: "Todos",
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
                      selected={
                        values.tipos_unidade ||
                        (unidadeEducacional && [
                          unidadeEducacional.tipo_unidade?.uuid,
                        ]) ||
                        []
                      }
                      options={tiposUnidades.map((tipoUnidade) => ({
                        label: tipoUnidade.iniciais,
                        value: tipoUnidade.uuid,
                      }))}
                      onSelectedChanged={(values_) =>
                        form.change(`tipos_unidade`, values_)
                      }
                      hasSelectAll
                      overrideStrings={{
                        selectSomeItems: "Selecione",
                        allItemsAreSelected: "Todos os tipos de unidade",
                        selectAll: "Todos",
                      }}
                      disabled={!values.status || unidadeEducacional}
                    />
                  </div>
                  <div className="col-8">
                    <label>Unidades Educacionais</label>
                    <Field
                      component={StatefulMultiSelect}
                      name="unidades_educacionais"
                      selected={
                        values.unidades_educacionais ||
                        (unidadeEducacional && [unidadeEducacional.uuid]) ||
                        []
                      }
                      options={filtroEscolas(unidadesEducacionais, values)}
                      onSelectedChanged={(values_) => {
                        form.change(`unidades_educacionais`, values_);
                      }}
                      hasSelectAll
                      overrideStrings={{
                        selectSomeItems: "Selecione",
                        allItemsAreSelected:
                          unidadesEducacionais.length > 1
                            ? "Todos os tipos de unidade"
                            : unidadesEducacionais[0] &&
                              unidadesEducacionais[0].nome,
                        selectAll: "Todos",
                      }}
                      disabled={!values.status || unidadeEducacional}
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
                        terceirizadas.map((terceirizada) => ({
                          nome: terceirizada.nome_fantasia,
                          uuid: terceirizada.uuid,
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
                    <div className="col-6 ps-0">
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
            </>
          )}
        </CollapseFiltros>
      )}
    </Spin>
  );
};
