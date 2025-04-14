import { Spin } from "antd";
import CollapseFiltros from "components/Shareable/CollapseFiltros";
import { InputComData } from "components/Shareable/DatePicker";
import { MultiselectRaw } from "components/Shareable/MultiselectRaw";
import Select from "components/Shareable/Select";
import { toastError } from "components/Shareable/Toast/dialogs";
import { required, requiredMultiselect } from "helpers/fieldValidators";
import { deepCopy } from "helpers/utilities";
import HTTP_STATUS from "http-status-codes";
import React, { useEffect, useState } from "react";
import { Field } from "react-final-form";
import { getTiposUnidadeEscolar } from "services/cadastroTipoAlimentacao.service";
import {
  getClassificacoesDietaEspecial,
  getSolicitacoesRelatorioHistoricoDietas,
  getUnidadesEducacionaisComCodEol,
} from "services/dietaEspecial.service";
import {
  buscaPeriodosEscolares,
  getTiposGestao,
} from "services/escola.service";
import { getLotesSimples } from "services/lote.service";

export const Filtros = ({ ...props }) => {
  const {
    setDietasEspeciais,
    onClear,
    setLoadingDietas,
    setValuesForm,
    setCount,
  } = props;

  const [tiposGestao, setTiposGestao] = useState(null);
  const [tiposUnidades, setTiposUnidades] = useState(null);
  const [lotes, setLotes] = useState(null);
  const [unidadesEducacionais, setUnidadesEducacionais] = useState(null);
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
      toastError("Erro ao buscar unidades educacionais");
    }
  };

  const getTiposGestaoAsync = async () => {
    const response = await getTiposGestao();
    if (response.results.length > 0) {
      setTiposGestao(response.results);
    } else {
      toastError("Erro ao buscar tipos de gestão");
    }
  };

  const getTiposUnidadesUEAsync = async () => {
    const response = await getTiposUnidadeEscolar();
    if (response.status === HTTP_STATUS.OK) {
      setTiposUnidades(response.data.results);
    } else {
      toastError("Erro ao buscar tipos de unidade educacional");
    }
  };

  const getLotesAsync = async () => {
    const response = await getLotesSimples();
    if (response.status === HTTP_STATUS.OK) {
      setLotes(response.data.results);
    } else {
      toastError("Erro ao buscar lotes");
    }
  };

  const getPeriodosAsync = async () => {
    const response = await buscaPeriodosEscolares();
    if (response.status === HTTP_STATUS.OK) {
      setPeriodos(response.data.results);
    } else {
      toastError("Erro ao buscar períodos escolares");
    }
  };

  const getClassificacoesDietaAsync = async () => {
    const response = await getClassificacoesDietaEspecial();
    if (response.status === HTTP_STATUS.OK) {
      setClassificacoesDieta(response.results);
    } else {
      toastError("Erro ao buscar classificações de dieta");
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

  const PAGE_SIZE = 10;
  const PARAMS = {
    page_size: PAGE_SIZE,
    page: 1,
  };

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() - 1);

  const onSubmit = async (values) => {
    const values_ = deepCopy(values);
    setValuesForm(values);
    if (values_.unidades_educacionais_selecionadas.includes("todas")) {
      delete values_.unidades_educacionais_selecionadas;
    }
    if (
      values_.tipos_unidades_selecionadas &&
      values_.tipos_unidades_selecionadas.includes("todos")
    ) {
      delete values_.tipos_unidades_selecionadas;
    }
    if (
      values_.periodos_escolares_selecionadas &&
      values_.periodos_escolares_selecionadas.includes("todos")
    ) {
      delete values_.periodos_escolares_selecionadas;
    }
    if (
      values_.classificacoes_selecionadas &&
      values_.classificacoes_selecionadas.includes("todas")
    ) {
      delete values_.classificacoes_selecionadas;
    }
    let params = {
      ...PARAMS,
      ...values_,
    };
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

  const LOADEDFILTROS =
    tiposGestao && tiposUnidades && lotes && periodos && classificacoesDieta;

  return (
    <CollapseFiltros
      onSubmit={onSubmit}
      onClear={onClear}
      titulo="Filtrar Resultados"
    >
      {(values, form) => (
        <Spin tip="Carregando filtros..." spinning={!LOADEDFILTROS}>
          {LOADEDFILTROS && (
            <>
              <div className="row">
                <div className="col-4">
                  <Field
                    label="Tipo de Gestão"
                    component={Select}
                    name="tipo_gestao"
                    placeholder="Selecione um tipo de gestão"
                    options={[
                      { nome: "Selecione um tipo de gestão", uuid: "" },
                    ].concat(
                      tiposGestao.map((tipoGestao) => ({
                        nome: tipoGestao.nome,
                        uuid: tipoGestao.uuid,
                      }))
                    )}
                    naoDesabilitarPrimeiraOpcao
                    onChangeEffect={async (e) => {
                      const value = e.target.value;
                      form.reset({
                        tipo_gestao: value,
                      });
                    }}
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
                  />
                </div>
                <div className="col-4">
                  <Field
                    label="DRE e Lote"
                    component={Select}
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
                  />
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-8">
                  <Spin
                    tip="Carregando unidades educacionais..."
                    spinning={
                      values.lote !== undefined && unidadesEducacionais === null
                    }
                  >
                    <Field
                      label="Unidade Educacional"
                      component={MultiselectRaw}
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
                      disabled={!values.lote}
                    />
                  </Spin>
                </div>
                <div className="col-4">
                  <Field
                    component={InputComData}
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
