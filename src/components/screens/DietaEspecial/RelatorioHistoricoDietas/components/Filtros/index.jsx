import React, { useEffect, useState } from "react";
import { Field } from "react-final-form";
import StatefulMultiSelect from "@khanacademy/react-multi-select";
import { Spin } from "antd";
import HTTP_STATUS from "http-status-codes";
import Select from "components/Shareable/Select";
import { InputComData } from "components/Shareable/DatePicker";
import CollapseFiltros from "components/Shareable/CollapseFiltros";
import { toastError } from "components/Shareable/Toast/dialogs";
import { required } from "helpers/fieldValidators";
import {
  getUnidadesEducacionaisComCodEol,
  getSolicitacoesRelatorioHistoricoDietas,
  getClassificacoesDietaEspecial,
} from "services/dietaEspecial.service";
import {
  getTiposGestao,
  buscaPeriodosEscolares,
} from "services/escola.service";
import { getTiposUnidadeEscolar } from "services/cadastroTipoAlimentacao.service";
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
  const [unidadesEducacionais, setUnidadesEducacionais] = useState([]);
  const [periodos, setPeriodos] = useState(null);
  const [classificacoesDieta, setClassificacoesDieta] = useState(null);

  const getUnidadesEducacionaisAsync = async (values) => {
    setUnidadesEducacionais([]);
    let data = values;
    const response = await getUnidadesEducacionaisComCodEol(data);
    if (response.status === HTTP_STATUS.OK) {
      setUnidadesEducacionais(
        response.data.map((unidade) => ({
          label: unidade.codigo_eol_escola,
          value: unidade.uuid,
        }))
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
    setValuesForm(values);
    let params = {
      ...PARAMS,
      ...values,
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
                    component={StatefulMultiSelect}
                    name="tipos_unidades_selecionadas"
                    options={tiposUnidades.map((tiposUnidade) => ({
                      label: tiposUnidade.iniciais,
                      value: tiposUnidade.uuid,
                    }))}
                    selected={values.tipos_unidades_selecionadas || []}
                    onSelectedChanged={(value) =>
                      form.change("tipos_unidades_selecionadas", value)
                    }
                    overrideStrings={{
                      search: "Busca",
                      selectSomeItems: "Selecione o tipo de unidade",
                      allItemsAreSelected:
                        "Todos os tipos de unidades estão selecionadas",
                      selectAll: "Todos",
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
                        nome: lote.nome,
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
                      values.lote !== undefined &&
                      unidadesEducacionais.length === 0
                    }
                  >
                    <label className="label fw-normal pb-2 pt-2">
                      Unidade Educacional
                    </label>
                    <Field
                      label="Unidades Educacionais"
                      component={StatefulMultiSelect}
                      name="unidades_educacionais_selecionadas"
                      placeholder="Selecione as Unidades Educacionais"
                      options={unidadesEducacionais}
                      selected={values.unidades_educacionais_selecionadas || []}
                      onSelectedChanged={(value) => {
                        form.change(
                          "unidades_educacionais_selecionadas",
                          value
                        );
                      }}
                      overrideStrings={{
                        search: "Busca",
                        selectSomeItems: "Selecione as Unidades Educacionais",
                        allItemsAreSelected:
                          "Todos as unidades estão selecionadas",
                        selectAll: "Todas",
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
                  <label className="label fw-normal pb-2 pt-2">
                    Períodos da Unidade
                  </label>
                  <Field
                    component={StatefulMultiSelect}
                    name="periodos_escolares_selecionadas"
                    options={periodos.map((periodo) => ({
                      label: periodo.nome,
                      value: periodo.uuid,
                    }))}
                    selected={values.periodos_escolares_selecionadas || []}
                    onSelectedChanged={(value) =>
                      form.change("periodos_escolares_selecionadas", value)
                    }
                    overrideStrings={{
                      search: "Busca",
                      selectSomeItems: "Selecione os períodos",
                      allItemsAreSelected:
                        "Todos os períodos estão selecionados",
                      selectAll: "Todos",
                    }}
                  />
                </div>
                <div className="col-4">
                  <label className="label fw-normal pb-2 pt-2">
                    Classificação das Dietas
                  </label>
                  <Field
                    component={StatefulMultiSelect}
                    name="classificacoes_selecionadas"
                    options={classificacoesDieta.map((classificacao) => ({
                      label: classificacao.nome,
                      value: classificacao.id,
                    }))}
                    selected={values.classificacoes_selecionadas || []}
                    onSelectedChanged={(value) =>
                      form.change("classificacoes_selecionadas", value)
                    }
                    overrideStrings={{
                      search: "Busca",
                      selectSomeItems: "Selecione a classificação",
                      allItemsAreSelected:
                        "Todas as classificações estão selecionadas",
                      selectAll: "Todos",
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
