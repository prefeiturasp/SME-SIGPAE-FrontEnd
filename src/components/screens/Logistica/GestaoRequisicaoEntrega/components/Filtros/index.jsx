import moment from "moment";
import React, { useState } from "react";
import { Form, Field } from "react-final-form";
import FinalFormToRedux from "src/components/Shareable/FinalFormToRedux";
import { InputComData } from "src/components/Shareable/DatePicker";
import Select from "src/components/Shareable/Select";
import { InputText } from "src/components/Shareable/Input/InputText";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import "./style.scss";
import { getNomesUnidadesEscolares } from "src/services/logistica.service";

const FORM_NAME = "buscaRequisicoesDilog";

export default ({
  setFiltros,
  setSolicitacoes,
  setTotal,
  initialValues,
  setInitialValues,
  inicioResultado,
}) => {
  const [desabilitarAluno, setDesabilitarAluno] = useState(false);

  const getTodosStatus = () => {
    return [
      "DILOG_ENVIA",
      "CANCELADA",
      "DISTRIBUIDOR_CONFIRMA",
      "DISTRIBUIDOR_SOLICITA_ALTERACAO",
      "DILOG_ACEITA_ALTERACAO",
      "AGUARDANDO_CANCELAMENTO",
    ];
  };

  const onSubmit = async (values) => {
    const filtros = { ...values };

    if (!filtros.status || filtros.status === "Todos") {
      filtros.status = getTodosStatus();
    }
    setFiltros({ ...filtros });
  };

  const getNomeUnidadeEscola = async (codigo, formValues) => {
    const values = { ...formValues };
    if (codigo.length !== 5) {
      delete values.nome_unidade;
      setInitialValues({ ...values });
      setDesabilitarAluno(false);
    } else {
      const response = await getNomesUnidadesEscolares({
        codigo_unidade: codigo,
      });
      if (response.status === 200) {
        if (response.data.results.length) {
          setInitialValues({
            ...values,
            nome_unidade: response.data.results[0].nome_unidade,
          });
          setDesabilitarAluno(true);
        } else {
          delete values.nome_unidade;
          setInitialValues({ ...values });
          setDesabilitarAluno(false);
        }
      } else {
        delete values.nome_unidade;
        setInitialValues({ ...values });
        setDesabilitarAluno(false);
      }
    }
  };

  return (
    <div className="filtros-requisicoes-listagem">
      <Form
        onSubmit={onSubmit}
        initialValues={initialValues}
        render={({ form, handleSubmit, submitting, values }) => (
          <form onSubmit={handleSubmit}>
            <FinalFormToRedux form={FORM_NAME} />
            <div className="row">
              <div className="col-3">
                <Field
                  dataTestId="numero-requisicao"
                  component={InputText}
                  apenasNumeros
                  label="N° da Requisição de Entrega"
                  name="numero_requisicao"
                  placeholder="Digite o Nº da Requisição"
                  className="input-busca-produto"
                />
              </div>
              <div className="col-3">
                <Field
                  dataTestId="numero-guia"
                  component={InputText}
                  apenasNumeros
                  label="N° da Guia de Remessa"
                  name="numero_guia"
                  placeholder="Digite o Nº da Guia"
                  className="input-busca-produto"
                />
              </div>
              <div className="col-6">
                <Field
                  dataTestId="numero-produto"
                  component={InputText}
                  label="Nome do Produto"
                  name="nome_produto"
                  placeholder="Digite o Nome do Produto"
                  className="input-busca-produto"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-4">
                <label className="col-form-label">
                  Selecionar Período de Entrega{" "}
                </label>
                <div className="row">
                  <div className="col-6">
                    <Field
                      component={InputComData}
                      name="data_inicial"
                      className="data-inicial"
                      placeholder="De"
                      minDate={null}
                      maxDate={
                        values.data_final
                          ? moment(values.data_final, "DD/MM/YYYY")._d
                          : null
                      }
                    />
                  </div>
                  <div className="col-6">
                    <Field
                      component={InputComData}
                      name="data_final"
                      popperPlacement="bottom-end"
                      placeholder="Até"
                      minDate={
                        values.data_inicial
                          ? moment(values.data_inicial, "DD/MM/YYYY")._d
                          : null
                      }
                      maxDate={null}
                    />
                  </div>
                </div>
              </div>

              <div className="col-2">
                <Field
                  component={InputText}
                  apenasNumeros
                  label="Código CODAE"
                  name="codigo_unidade"
                  placeholder="Digite o Código"
                  className="input-busca-produto"
                  inputOnChange={(e) => {
                    const value = e.target.value;
                    const values_ = form.getState().values;

                    getNomeUnidadeEscola(value, values_);
                  }}
                />
              </div>
              <div className="col-6">
                <Field
                  component={InputText}
                  label="Nome da UE"
                  name="nome_unidade"
                  placeholder="Digite o nome da UE"
                  className="input-busca-produto"
                  disabled={desabilitarAluno}
                />
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-6">
                <Field
                  dataTestId="select-status"
                  component={Select}
                  label="Status"
                  name="status"
                  placeholder="Status"
                  options={[
                    { uuid: "", nome: "Selecione" },
                    { uuid: undefined, nome: "Todos" },
                    { uuid: "DILOG_ENVIA", nome: "Recebida" },
                    {
                      uuid: "AGUARDANDO_CANCELAMENTO",
                      nome: "Aguardando cancelamento",
                    },
                    { uuid: "CANCELADA", nome: "Cancelada" },
                    { uuid: "DISTRIBUIDOR_CONFIRMA", nome: "Confirmada" },
                    { uuid: "DILOG_ACEITA_ALTERACAO", nome: "Alterada" },
                    {
                      uuid: "DISTRIBUIDOR_SOLICITA_ALTERACAO",
                      nome: "Em análise",
                    },
                  ]}
                  className="input-busca-produto"
                />
              </div>
            </div>
            <div className="mt-4 mb-4" ref={inicioResultado}>
              <Botao
                dataTestId="botao-consultar"
                texto="Consultar"
                type={BUTTON_TYPE.SUBMIT}
                style={BUTTON_STYLE.GREEN}
                className="float-end ms-3"
                disabled={submitting}
              />

              <Botao
                dataTestId="botao-limpar"
                texto="Limpar Filtros"
                type={BUTTON_TYPE.BUTTON}
                style={BUTTON_STYLE.GREEN_OUTLINE}
                className="float-end ms-3"
                onClick={() => {
                  form.reset({});
                  setSolicitacoes(undefined);
                  setTotal(undefined);
                }}
              />
            </div>
          </form>
        )}
      />
    </div>
  );
};
