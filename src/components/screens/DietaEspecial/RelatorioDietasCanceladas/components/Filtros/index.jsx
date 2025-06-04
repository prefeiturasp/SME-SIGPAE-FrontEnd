import React, { useEffect } from "react";
import { Field } from "react-final-form";
import StatefulMultiSelect from "@khanacademy/react-multi-select";
import { Spin } from "antd";
import HTTP_STATUS from "http-status-codes";
import moment from "moment";
import { InputComData } from "src/components/Shareable/DatePicker";
import CollapseFiltros from "src/components/Shareable/CollapseFiltros";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { usuarioEhEmpresaTerceirizada } from "src/helpers/utilities";
import {
  getUnidadesEducacionaisTercTotal,
  getSolicitacoesRelatorioDietasEspeciais,
} from "src/services/dietaEspecial.service";
import "./styles.scss";

export const Filtros = ({ ...props }) => {
  const {
    erroAPI,
    filtros,
    meusDados,
    setDietasEspeciais,
    setUnidadesEducacionais,
    unidadesEducacionais,
    onClear,
    setLoadingDietas,
    setValuesForm,
  } = props;

  const getUnidadesEducacionaisAsync = async (values) => {
    setUnidadesEducacionais([]);
    let data = { lotes: values };
    const response = await getUnidadesEducacionaisTercTotal(data);
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

  const LOADING = !filtros || !meusDados || erroAPI;

  const PAGE_SIZE = 10;
  const PARAMS = { limit: PAGE_SIZE, offset: 0 };

  useEffect(() => {
    if (filtros?.lotes.length === 1) {
      getUnidadesEducacionaisAsync({ lote: filtros.lotes[0].uuid });
    }
  }, [filtros]);

  const onSubmit = async (values) => {
    const filtrosValues = {
      ...values,
      status_selecionado: "CANCELADAS",
    };
    setValuesForm(filtrosValues);
    setLoadingDietas(true);
    let params = {
      ...PARAMS,
      ...filtrosValues,
    };
    if (usuarioEhEmpresaTerceirizada()) {
      params["terceirizada"] = meusDados.vinculo_atual.instituicao.uuid;
    }
    const response = await getSolicitacoesRelatorioDietasEspeciais(params);
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
    <>
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
                    <Field
                      component={InputComData}
                      label="Período de:"
                      name="data_cancelamento_inicial"
                      placeholder="Selecione"
                      maxDate={
                        moment(values.data_cancelamento_final, "DD/MM/YYYY")._d
                      }
                      minDate={null}
                    />
                  </div>
                  <div className="col-4">
                    <Field
                      component={InputComData}
                      label="Até:"
                      name="data_cancelamento_final"
                      placeholder="Selecione"
                      minDate={
                        moment(values.data_cancelamento_inicial, "DD/MM/YYYY")
                          ._d
                      }
                      maxDate={new Date()}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-4">
                    <label className="label fw-normal pb-2 pt-2">Lote</label>
                    <Field
                      component={StatefulMultiSelect}
                      name="lotes"
                      options={filtros.lotes.map((lote) => ({
                        label: lote.nome,
                        value: lote.uuid,
                      }))}
                      selected={values.lotes_selecionados || []}
                      onSelectedChanged={(value) => {
                        form.change("lotes_selecionados", value);
                        if (value && value.length === 0) {
                          setUnidadesEducacionais([]);
                          form.change(
                            "unidades_educacionais_selecionadas",
                            undefined
                          );
                        } else {
                          getUnidadesEducacionaisAsync(value);
                        }
                      }}
                      overrideStrings={{
                        search: "Busca",
                        selectSomeItems: "Selecione lotes",
                        allItemsAreSelected:
                          "Todos os lotes estão selecionados",
                        selectAll: "Todos",
                      }}
                    />
                  </div>
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
                        selectSomeItems: "Selecione classificações de dieta",
                        allItemsAreSelected:
                          "Todos as classificações estão selecionadas",
                        selectAll: "Todas",
                      }}
                    />
                  </div>
                </div>
                <div className="row mt-3">
                  {!usuarioEhEmpresaTerceirizada() && (
                    <div className="col-4">
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
                        selected={
                          values.alergias_intolerancias_selecionadas || []
                        }
                        onSelectedChanged={(value) =>
                          form.change(
                            "alergias_intolerancias_selecionadas",
                            value
                          )
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
                  )}
                  {usuarioEhEmpresaTerceirizada() && (
                    <div className="col-4">
                      <label className="label fw-normal pb-2 pt-2">
                        Protocolo padrão
                      </label>
                      <Field
                        component={StatefulMultiSelect}
                        name="protocolos_padrao"
                        options={filtros.protocolos_padrao.map(
                          (protocolo_padrao) => ({
                            label: protocolo_padrao.nome,
                            value: protocolo_padrao.uuid,
                          })
                        )}
                        selected={values.protocolos_padrao_selecionados || []}
                        onSelectedChanged={(value) =>
                          form.change("protocolos_padrao_selecionados", value)
                        }
                        overrideStrings={{
                          search: "Busca",
                          selectSomeItems: "Selecione protocolos padrão",
                          allItemsAreSelected:
                            "Todos os protocolos padrão estão selecionados",
                          selectAll: "Todos",
                        }}
                      />
                    </div>
                  )}
                  <div className="col-6">
                    <label className="label fw-normal pb-2 pt-2">
                      Unidades Educacionais
                    </label>
                    <Spin
                      tip="Carregando unidades educacionais..."
                      spinning={
                        values.lotes_selecionados !== undefined &&
                        values.lotes_selecionados.length > 0 &&
                        unidadesEducacionais.length === 0
                      }
                    >
                      <Field
                        component={StatefulMultiSelect}
                        name="unidades_educacionais"
                        options={unidadesEducacionais}
                        selected={
                          values.unidades_educacionais_selecionadas || []
                        }
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
                        disabled={!values.lotes_selecionados}
                      />
                    </Spin>
                  </div>
                </div>
              </>
            )}
          </Spin>
        )}
      </CollapseFiltros>
    </>
  );
};
