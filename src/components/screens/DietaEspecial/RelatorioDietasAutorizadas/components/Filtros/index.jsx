import StatefulMultiSelect from "@khanacademy/react-multi-select";
import { Spin } from "antd";
import HTTP_STATUS from "http-status-codes";
import { useEffect } from "react";
import { Field } from "react-final-form";
import CollapseFiltros from "src/components/Shareable/CollapseFiltros";
import { MultiselectRaw } from "src/components/Shareable/MultiselectRaw";
import Select from "src/components/Shareable/Select";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { usuarioEhDRE } from "src/helpers/utilities";
import {
  getSolicitacoesRelatorioDietasEspeciais,
  getUnidadesEducacionaisComCodEol,
} from "src/services/dietaEspecial.service";
import { getTotalizadoresRelatorioSolicitacoes } from "src/services/relatorios.service";
import "./styles.scss";

export const Filtros = ({ ...props }) => {
  const {
    erroAPI,
    filtros,
    meusDados,
    setDietasEspeciais,
    setErroAPI,
    setUnidadesEducacionais,
    unidadesEducacionais,
    onClear,
    setLoadingDietas,
    setValuesForm,
    getFiltrosRelatorioDietasEspeciaisAsync,
    setTotalizadores,
    setRenderGraficosOuTabela,
  } = props;

  const getUnidadesEducacionaisAsync = async (values) => {
    setUnidadesEducacionais([]);
    let data = values;
    const response = await getUnidadesEducacionaisComCodEol(data);
    if (response.status === HTTP_STATUS.OK) {
      if (response.data.mensagem) {
        setUnidadesEducacionais([
          {
            label: response.data.mensagem,
            value: "__no_result__",
            disabled: true,
          },
        ]);
        return;
      }
      setUnidadesEducacionais(
        response.data.map((unidade) => ({
          label: `${unidade.codigo_eol_escola}`,
          value: unidade.uuid,
        })),
      );
    } else {
      toastError("Erro ao buscar unidades educacionais");
    }
  };

  const LOADING = !filtros || !meusDados || erroAPI;

  const PAGE_SIZE = 10;
  const PARAMS = { limit: PAGE_SIZE, offset: 0 };

  useEffect(() => {
    if (filtros?.lotes.length === 1) {
      getUnidadesEducacionaisAsync({ lote: filtros.lotes[0].uuid });
    }
  }, [filtros]);

  const getTotalizadoresAsync = async (values) => {
    const response = await getTotalizadoresRelatorioSolicitacoes(values);
    if (response.status === HTTP_STATUS.OK) {
      setTotalizadores(response.data.results);
    } else {
      setErroAPI("Erro ao carregar totalizadores. Tente novamente mais tarde.");
    }
  };

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
    await getTotalizadoresAsync(params);
    if (response.status === HTTP_STATUS.OK) {
      setDietasEspeciais(response.data);
    } else {
      toastError(
        "Erro ao carregar dados das dietas especiais. Tente novamente mais tarde.",
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
                    dataTestId="tipo-gestao-select"
                    component={Select}
                    name="tipo_gestao"
                    placeholder="Selecione o tipo de gestão"
                    options={[
                      { nome: "Selecione o tipo de gestão", uuid: "" },
                    ].concat(
                      filtros.tipos_gestao.map((tipo_gestao) => ({
                        nome: tipo_gestao.nome,
                        uuid: tipo_gestao.uuid,
                      })),
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
                    component={MultiselectRaw}
                    placeholder="Selecione o tipo de unidade"
                    name="tipo_unidade"
                    dataTestId="select-tipo-unidade"
                    options={filtros.tipos_unidades.map((tipo_unidade) => ({
                      label: tipo_unidade.nome,
                      value: tipo_unidade.uuid,
                    }))}
                    selected={values.tipos_unidades_selecionadas || []}
                    onSelectedChanged={async (values_) => {
                      form.change(
                        `tipos_unidades_selecionadas`,
                        values_.map((value_) => value_.value),
                      );
                      let { lote } = form.getState().values;
                      if (filtros?.lotes.length === 1) {
                        lote = filtros.lotes[0].uuid;
                      }
                      await getUnidadesEducacionaisAsync({
                        lote,
                        tipos_unidades_selecionadas: values_.map(
                          (value_) => value_.value,
                        ),
                      });
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
                    dataTestId="div-select-dre-lote"
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
                            })),
                          )
                    }
                    naoDesabilitarPrimeiraOpcao
                    onChangeEffect={async (e) => {
                      const value = e.target.value;
                      if (value && value.length === 0) {
                        setUnidadesEducacionais([]);
                        form.change(
                          "unidades_educacionais_selecionadas",
                          undefined,
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
                          value,
                        );
                      }}
                      overrideStrings={{
                        search: "Busca",
                        selectSomeItems: "Selecione unidades educacionais",
                        allItemsAreSelected:
                          "Todos as unidades estão selecionadas",
                        selectAll: "Todas",
                      }}
                      disabled={
                        (unidadesEducacionais.length === 1 &&
                          unidadesEducacionais[0].value === "__no_result__") ||
                        (filtros.lotes.length > 1 && !values.lote)
                      }
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
                      }),
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
                      component="input"
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
                      component="input"
                      type="checkbox"
                      name="recreio_nas_ferias"
                      className="ckbox-recreio-nas-ferias"
                    />
                  </span>
                  <span className="label-motivo-alteracao-ue">
                    RECREIO NAS FÉRIAS
                  </span>
                </div>
                <div>
                  <span>
                    <Field
                      component="input"
                      data-testid="checkbox-outro"
                      type="checkbox"
                      name="outro"
                      className="ckbox-outro"
                    />
                  </span>
                  <span className="label-motivo-alteracao-ue">OUTRO</span>
                </div>
              </div>
            </>
          )}
        </Spin>
      )}
    </CollapseFiltros>
  );
};
