import React, { useEffect, useState } from "react";
import { Field } from "react-final-form";
import StatefulMultiSelect from "@khanacademy/react-multi-select";
import { Spin } from "antd";
import HTTP_STATUS from "http-status-codes";
import Select from "components/Shareable/Select";
import CollapseFiltros from "components/Shareable/CollapseFiltros";
import { toastError } from "components/Shareable/Toast/dialogs";
import { usuarioEhDRE } from "helpers/utilities";
import {
  getUnidadesEducacionaisComCodEol,
  getSolicitacoesRelatorioDietasEspeciais,
} from "services/dietaEspecial.service";
import { getTiposGestao } from "services/escola.service";
import "./styles.scss";

export const Filtros = ({ ...props }) => {
  const {
    filtros,
    meusDados,
    setDietasEspeciais,
    setUnidadesEducacionais,
    unidadesEducacionais,
    onClear,
    setLoadingDietas,
    setValuesForm,
    getFiltrosRelatorioDietasEspeciaisAsync,
    setRenderGraficosOuTabela,
  } = props;

  const [tiposGestao, setTiposGestao] = useState(null);

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
    if (response.status === HTTP_STATUS.OK) {
      setTiposGestao(response.data.results);
    } else {
      toastError("Erro ao buscar tipos de gestão");
    }
  };

  const LOADING = !filtros || !meusDados;

  const PAGE_SIZE = 10;
  const PARAMS = { limit: PAGE_SIZE, offset: 0 };

  useEffect(() => {
    getTiposGestaoAsync();
  }, []);

  const onSubmit = async (values) => {
    setRenderGraficosOuTabela("Gráficos");
    const filtrosValues = {
      ...values,
      status_selecionado: "AUTORIZADAS",
    };
    if (usuarioEhDRE() && filtros.lotes.length === 1) {
      filtrosValues["lote"] = filtros.lotes[0].uuid;
    }
    setValuesForm(filtrosValues);
    setLoadingDietas(true);
    let params = {
      ...PARAMS,
      ...filtrosValues,
    };
    const response = await getSolicitacoesRelatorioDietasEspeciais(params);
    params["relatorio_dietas_autorizadas"] = true;
    if (response.status === HTTP_STATUS.OK) {
      setDietasEspeciais(response.data);
    } else {
      toastError(
        "Erro ao carregar dados das dietas especiais. Tente novamente mais tarde."
      );
    }
    setLoadingDietas(false);
  };

  return (
    <CollapseFiltros
      onSubmit={onSubmit}
      onClear={onClear}
      titulo="Filtrar Resultados"
      manterFiltros={["status_selecionado"]}
    >
      {(values, form) => (
        <Spin tip="Carregando filtros..." spinning={LOADING}>
          {filtros && (
            <>
              <div className="row">
                <div className="col-4">
                  <label className="label fw-normal pb-2 pt-2">
                    Tipo de Gestão
                  </label>
                  <Field
                    component={Select}
                    name="tipo_gestao"
                    placeholder="Selecione o tipo de gestão"
                    options={[
                      { nome: "Selecione o tipo de gestão", uuid: "" },
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
                      const values_ = form.getState().values;
                      await getFiltrosRelatorioDietasEspeciaisAsync({
                        ...values_,
                        status_selecionado: "AUTORIZADAS",
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
                    name="tipo_unidade"
                    options={filtros.tipos_unidades.map((tipo_unidade) => ({
                      label: tipo_unidade.nome,
                      value: tipo_unidade.uuid,
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
                  <label className="label fw-normal pb-2 pt-2">
                    DRE e Lote
                  </label>
                  <Field
                    component={Select}
                    name="lote"
                    placeholder="Selecione a DRE/Lote"
                    options={
                      filtros.lotes.length === 1
                        ? [
                            {
                              nome: filtros.lotes[0].nome,
                              uuid: filtros.lotes[0].uuid,
                            },
                          ]
                        : [{ nome: "Selecione a DRE/Lote", uuid: "" }].concat(
                            filtros.lotes.map((lote) => ({
                              nome: lote.nome,
                              uuid: lote.uuid,
                            }))
                          )
                    }
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
                <div className="col-12">
                  <label className="label fw-normal pb-2 pt-2">
                    Unidades Educacionais
                  </label>
                  <Spin
                    tip="Carregando unidades educacionais..."
                    spinning={
                      values.lote !== undefined &&
                      values.lote.length > 0 &&
                      unidadesEducacionais.length === 0
                    }
                  >
                    <Field
                      component={StatefulMultiSelect}
                      name="unidades_educacionais"
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
                        selectSomeItems: "Selecione unidades educacionais",
                        allItemsAreSelected:
                          "Todos as unidades estão selecionadas",
                        selectAll: "Todas",
                      }}
                      disabled={filtros.lotes.length > 1 && !values.lote}
                    />
                  </Spin>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-4">
                  <label className="label fw-normal pb-2 pt-2">
                    Classificação da dieta
                  </label>
                  <Field
                    component={StatefulMultiSelect}
                    name="classificacoes"
                    options={filtros.classificacoes.map((classificacao) => ({
                      label: classificacao.nome,
                      value: classificacao.id,
                    }))}
                    selected={values.classificacoes_selecionadas || []}
                    onSelectedChanged={(value) =>
                      form.change("classificacoes_selecionadas", value)
                    }
                    overrideStrings={{
                      search: "Busca",
                      selectSomeItems: "Selecione as classificações de dietas",
                      allItemsAreSelected:
                        "Todos as classificações estão selecionadas",
                      selectAll: "Todas",
                    }}
                  />
                </div>
                <div className="col-8">
                  <label className="label fw-normal pb-2 pt-2">
                    Relação por Diagnóstico
                  </label>
                  <Field
                    component={StatefulMultiSelect}
                    name="alergias_intolerancias"
                    options={filtros.alergias_intolerancias.map(
                      (alergia_intolerancia) => ({
                        label: alergia_intolerancia.nome,
                        value: alergia_intolerancia.id,
                      })
                    )}
                    selected={values.alergias_intolerancias_selecionadas || []}
                    onSelectedChanged={(value) =>
                      form.change("alergias_intolerancias_selecionadas", value)
                    }
                    overrideStrings={{
                      search: "Busca",
                      selectSomeItems: "Selecione diagnósticos",
                      allItemsAreSelected:
                        "Todos os diagnósticos estão selecionados",
                      selectAll: "Todos",
                    }}
                  />
                </div>
              </div>
              <div className="mt-4 motivos-alteracao-ue col-12">
                <div>
                  <span>
                    <Field
                      component={"input"}
                      type="checkbox"
                      name="cei_polo"
                      className="ckbox-motivo-alteracao-ue"
                    />
                  </span>
                  <span className="label-motivo-alteracao-ue">CEI POLO</span>
                </div>
                <div>
                  <span>
                    <Field
                      component={"input"}
                      type="checkbox"
                      name="recreio_nas_ferias"
                      className="ckbox-recreio-nas-ferias"
                    />
                  </span>
                  <span className="label-motivo-alteracao-ue">
                    RECREIO NAS FÉRIAS
                  </span>
                </div>
              </div>
            </>
          )}
        </Spin>
      )}
    </CollapseFiltros>
  );
};
