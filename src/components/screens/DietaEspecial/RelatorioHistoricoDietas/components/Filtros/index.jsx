import { Spin } from "antd";
import CollapseFiltros from "src/components/Shareable/CollapseFiltros";
import { InputComData } from "src/components/Shareable/DatePicker";
import { MultiselectRaw } from "src/components/Shareable/MultiselectRaw";
import Select from "src/components/Shareable/Select";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { required, requiredMultiselect } from "src/helpers/fieldValidators";
import {
  usuarioEhCogestorDRE,
  usuarioEhEmpresa,
  usuarioEhEscola,
} from "src/helpers/utilities";
import HTTP_STATUS from "http-status-codes";
import React, { useEffect, useState } from "react";
import { Field } from "react-final-form";
import { getTiposUnidadeEscolar } from "src/services/cadastroTipoAlimentacao.service";
import {
  getClassificacoesDietaEspecial,
  getSolicitacoesRelatorioHistoricoDietas,
  getUnidadesEducacionaisComCodEol,
} from "src/services/dietaEspecial.service";
import {
  buscaPeriodosEscolares,
  getTiposGestao,
} from "src/services/escola.service";
import { getLotesSimples } from "src/services/lote.service";
import { normalizarValues } from "../../helper";

export const Filtros = ({ ...props }) => {
  const {
    meusDados,
    setDietasEspeciais,
    setLoadingDietas,
    setValuesForm,
    setCount,
    setErro,
  } = props;

  const [formInstance, setFormInstance] = useState(null);

  const [tiposGestao, setTiposGestao] = useState(null);
  const [tiposUnidades, setTiposUnidades] = useState(null);
  const [lotes, setLotes] = useState(null);
  const [unidadesEducacionais, setUnidadesEducacionais] = useState(
    usuarioEhEscola()
      ? [
          {
            label: meusDados.vinculo_atual.instituicao.nome,
            value: meusDados.vinculo_atual.instituicao.uuid,
          },
        ]
      : null
  );
  const [periodos, setPeriodos] = useState(null);
  const [classificacoesDieta, setClassificacoesDieta] = useState(null);

  const getUnidadesEducacionaisAsync = async (values) => {
    setUnidadesEducacionais(null);
    let data = values;
    const response = await getUnidadesEducacionaisComCodEol(data);
    if (response.status === HTTP_STATUS.OK) {
      if (response.data.length === 0) {
        toastError("Nenhuma unidade educacional encontrada");
      }
      setUnidadesEducacionais(
        [
          {
            label: "Todas as unidades",
            value: "todas",
          },
        ].concat(
          response.data.map((unidade) => ({
            label: unidade.codigo_eol_escola,
            value: unidade.uuid,
          }))
        )
      );
    } else {
      setErro(
        "Erro ao carregar unidades educacionais. Tente novamente mais tarde."
      );
    }
  };

  const getTiposGestaoAsync = async () => {
    const response = await getTiposGestao();
    if (response.status === HTTP_STATUS.OK) {
      if (response.data.results.length > 0) {
        setTiposGestao(response.data.results);
      } else {
        toastError("Erro ao buscar tipos de gestão");
      }
    } else {
      setErro("Erro ao carregar tipos de gestão. Tente novamente mais tarde.");
    }
  };

  const getTiposUnidadesUEAsync = async () => {
    const response = await getTiposUnidadeEscolar();
    if (response.status === HTTP_STATUS.OK) {
      setTiposUnidades(response.data.results);
    } else {
      setErro(
        "Erro ao carregar tipos de unidade educacional. Tente novamente mais tarde."
      );
    }
  };

  const getLotesAsync = async () => {
    let params = {};
    if (usuarioEhEscola()) {
      params["uuid"] = meusDados.vinculo_atual.instituicao.lotes[0].uuid;
    } else if (usuarioEhCogestorDRE()) {
      params["diretoria_regional__uuid"] =
        meusDados.vinculo_atual.instituicao.uuid;
    } else if (usuarioEhEmpresa()) {
      params["terceirizada__uuid"] = meusDados.vinculo_atual.instituicao.uuid;
    }
    const response = await getLotesSimples(params);
    if (response.status === HTTP_STATUS.OK) {
      setLotes(response.data.results);
    } else {
      setErro("Erro ao carregar lotes. Tente novamente mais tarde.");
    }
  };

  const getPeriodosAsync = async () => {
    const response = await buscaPeriodosEscolares();
    if (response.status === HTTP_STATUS.OK) {
      setPeriodos(response.data.results);
    } else {
      setErro(
        "Erro ao carregar períodos escolares. Tente novamente mais tarde."
      );
    }
  };

  const getClassificacoesDietaAsync = async () => {
    const response = await getClassificacoesDietaEspecial();
    if (response.status === HTTP_STATUS.OK) {
      setClassificacoesDieta(response.data);
    } else {
      setErro(
        "Erro ao carregar classificações de dieta. Tente novamente mais tarde."
      );
    }
  };

  const carregaFiltros = async () => {
    getTiposGestaoAsync();
    getTiposUnidadesUEAsync();
    getLotesAsync();
    getPeriodosAsync();
    getClassificacoesDietaAsync();
  };

  useEffect(() => {
    carregaFiltros();
  }, []);

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() - 1);

  const onSubmit = async (values) => {
    setValuesForm(values);
    const params = normalizarValues(values, 1);
    setLoadingDietas(true);
    const response = await getSolicitacoesRelatorioHistoricoDietas(params);
    if (response.status === HTTP_STATUS.OK) {
      setDietasEspeciais(response.data);
      setCount(response.data.count);
    } else {
      toastError(
        "Erro ao carregar dados das dietas especiais. Tente novamente mais tarde."
      );
    }
    setLoadingDietas(false);
  };

  const onClear = (form) => {
    setDietasEspeciais(null);
    if (usuarioEhEscola()) {
      form.change("data", undefined);
      form.change("periodos_escolares_selecionadas", undefined);
      form.change("classificacoes_selecionadas", undefined);
      form.change(
        "tipo_gestao",
        meusDados.vinculo_atual.instituicao.tipo_gestao_uuid
      );
      form.change("lote", meusDados.vinculo_atual.instituicao.lotes[0].uuid);
      form.change("tipos_unidades_selecionadas", [
        meusDados.vinculo_atual.instituicao.tipo_unidade_escolar,
      ]);

      form.change("unidades_educacionais_selecionadas", [
        meusDados.vinculo_atual.instituicao.uuid,
      ]);
    }
  };

  const LOADEDFILTROS =
    !!tiposGestao &&
    !!tiposUnidades &&
    !!lotes &&
    !!periodos &&
    !!classificacoesDieta;

  const getInitialValues = () => {
    if (!LOADEDFILTROS) return null;
    if (usuarioEhEscola()) {
      return {
        tipo_gestao: meusDados.vinculo_atual.instituicao.tipo_gestao_uuid,
        lote: meusDados.vinculo_atual.instituicao.lotes[0].uuid,
        tipos_unidades_selecionadas: [
          meusDados.vinculo_atual.instituicao.tipo_unidade_escolar,
        ],
        unidades_educacionais_selecionadas: [
          meusDados.vinculo_atual.instituicao.uuid,
        ],
      };
    } else {
      return null;
    }
  };

  return (
    <CollapseFiltros
      onSubmit={onSubmit}
      onClear={() => onClear(formInstance)}
      titulo="Filtrar Resultados"
      keepDirtyOnReinitialize={usuarioEhEscola()}
      meusDados={meusDados}
      initialValues={getInitialValues()}
    >
      {(values, form) => (
        <Spin tip="Carregando filtros..." spinning={!LOADEDFILTROS}>
          {LOADEDFILTROS && (
            <>
              {!formInstance && setFormInstance(form)}
              <div className="row">
                <div className="col-4">
                  <Field
                    label="Tipo de Gestão"
                    component={Select}
                    name="tipo_gestao"
                    placeholder="Selecione um tipo de gestão"
                    options={[
                      { nome: "Selecione um tipo de gestão", uuid: null },
                    ].concat(
                      tiposGestao.map((tipoGestao) => ({
                        nome: tipoGestao.nome,
                        uuid: tipoGestao.uuid,
                      }))
                    )}
                    naoDesabilitarPrimeiraOpcao
                    disabled={usuarioEhEscola()}
                  />
                </div>
                <div className="col-4">
                  <label className="label fw-normal pb-2 pt-2">
                    Tipo de Unidade
                  </label>
                  <Field
                    component={MultiselectRaw}
                    name="tipos_unidades_selecionadas"
                    options={[
                      { label: "Todos os tipos de unidade", value: "todos" },
                    ].concat(
                      tiposUnidades.map((tiposUnidade) => ({
                        label: tiposUnidade.iniciais,
                        value: tiposUnidade.uuid,
                      }))
                    )}
                    selected={values.tipos_unidades_selecionadas || []}
                    onSelectedChanged={(values_) => {
                      form.change(
                        `tipos_unidades_selecionadas`,
                        values_.map((value_) => value_.value)
                      );
                    }}
                    disabled={usuarioEhEscola()}
                  />
                </div>
                <div className="col-4">
                  <Field
                    label="DRE e Lote"
                    component={Select}
                    dataTestId="select-dre-lote"
                    name="lote"
                    required
                    validate={required}
                    placeholder="Selecione DRE/Lote"
                    options={[{ nome: "Selecione DRE/Lote", uuid: "" }].concat(
                      lotes.map((lote) => ({
                        nome: `${lote.nome} - ${lote.diretoria_regional.nome}`,
                        uuid: lote.uuid,
                      }))
                    )}
                    naoDesabilitarPrimeiraOpcao
                    onChangeEffect={async (e) => {
                      const value = e.target.value;
                      form.change("unidades_educacionais_selecionadas", []);
                      if (value && value.length === 0) {
                        setUnidadesEducacionais([]);
                        form.change(
                          "unidades_educacionais_selecionadas",
                          undefined
                        );
                      } else {
                        getUnidadesEducacionaisAsync(form.getState().values);
                      }
                    }}
                    disabled={usuarioEhEscola()}
                  />
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-8">
                  <Spin
                    tip="Carregando unidades educacionais..."
                    spinning={
                      values.lote !== undefined &&
                      unidadesEducacionais === null &&
                      !usuarioEhEscola()
                    }
                  >
                    <Field
                      label="Unidade Educacional"
                      component={MultiselectRaw}
                      dataTestId="select-unidades-educacionais"
                      required
                      validate={requiredMultiselect}
                      name="unidades_educacionais_selecionadas"
                      placeholder="Selecione as Unidades Educacionais"
                      options={unidadesEducacionais || []}
                      selected={values.unidades_educacionais_selecionadas || []}
                      onSelectedChanged={(values_) => {
                        form.change(
                          `unidades_educacionais_selecionadas`,
                          values_.map((value_) => value_.value)
                        );
                      }}
                      disabled={!values.lote || usuarioEhEscola()}
                    />
                  </Spin>
                </div>
                <div className="col-4">
                  <Field
                    component={InputComData}
                    dataTestId="div-input-data"
                    label="Data"
                    required
                    validate={required}
                    name="data"
                    placeholder="Dia de referência"
                    maxDate={maxDate}
                    minDate={null}
                  />
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-4">
                  <Field
                    label="Períodos da Unidade"
                    component={MultiselectRaw}
                    name="periodos_escolares_selecionadas"
                    options={[
                      {
                        label: "Todos os períodos escolares",
                        value: "todos",
                      },
                    ].concat(
                      periodos.map((periodo) => ({
                        label: periodo.nome,
                        value: periodo.uuid,
                      }))
                    )}
                    selected={values.periodos_escolares_selecionadas || []}
                    onSelectedChanged={(values_) => {
                      form.change(
                        `periodos_escolares_selecionadas`,
                        values_.map((value_) => value_.value)
                      );
                    }}
                  />
                </div>
                <div className="col-4">
                  <label className="label fw-normal pb-2 pt-2">
                    Classificação das Dietas
                  </label>
                  <Field
                    component={MultiselectRaw}
                    name="classificacoes_selecionadas"
                    options={[
                      {
                        label: "Todas as classificações de dieta",
                        value: "todas",
                      },
                    ].concat(
                      classificacoesDieta.map((classificacao) => ({
                        label: classificacao.nome,
                        value: classificacao.id,
                      }))
                    )}
                    selected={values.classificacoes_selecionadas || []}
                    onSelectedChanged={(values_) => {
                      form.change(
                        `classificacoes_selecionadas`,
                        values_.map((value_) => value_.value)
                      );
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </Spin>
      )}
    </CollapseFiltros>
  );
};
