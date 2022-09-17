import moment from "moment";
import React, { useState } from "react";
import { Form, Field } from "react-final-form";
import { OnChange } from "react-final-form-listeners";
import FinalFormToRedux from "components/Shareable/FinalFormToRedux";
import { InputComData } from "components/Shareable/DatePicker";
import Select from "components/Shareable/Select";
import { InputText } from "components/Shareable/Input/InputText";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE
} from "components/Shareable/Botao/constants";
import "./style.scss";
import { getNomesUnidadesEscolares } from "services/logistica.service.js";

const FORM_NAME = "buscaRequisicoesDilog";

export default ({
  setFiltros,
  setSolicitacoes,
  setTotal,
  initialValues,
  setInitialValues,
  inicioResultado
}) => {
  const [desabilitarAluno, setDesabilitarAluno] = useState(false);

  const getTodosStatus = () => {
    return [
      "DILOG_ENVIA",
      "CANCELADA",
      "DISTRIBUIDOR_CONFIRMA",
      "DISTRIBUIDOR_SOLICITA_ALTERACAO",
      "DILOG_ACEITA_ALTERACAO",
      "AGUARDANDO_CANCELAMENTO"
    ];
  };

  const onSubmit = async values => {
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
        codigo_unidade: codigo
      });
      if (response.status === 200) {
        if (response.data.results.length) {
          setInitialValues({
            ...values,
            nome_unidade: response.data.results[0].nome_unidade
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
                  component={InputText}
                  label="N° da Requisição de Entrega"
                  name="numero_requisicao"
                  placeholder="Digite o número da requisição"
                  className="input-busca-produto"
                />
              </div>
              <div className="col-3">
                <Field
                  component={InputText}
                  label="Nº da Guia de Remessa"
                  name="numero_guia"
                  placeholder="Digite o número da guia"
                  className="input-busca-produto"
                />
              </div>
              <div className="col-6">
                <Field
                  component={InputText}
                  label="Nome do produto"
                  name="nome_produto"
                  placeholder="Digite o nome do produto"
                  className="input-busca-produto"
                />
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-2">
                <Field
                  component={InputComData}
                  label="Período de Entrega"
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
              <div className="col-2">
                <Field
                  component={InputComData}
                  label="&nbsp;"
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
              <div className="col-2">
                <Field
                  component={InputText}
                  label="Cód. CODAE da UE"
                  name="codigo_unidade"
                  placeholder="Digite o código"
                  className="input-busca-produto"
                />

                <OnChange name="codigo_unidade">
                  {value => {
                    getNomeUnidadeEscola(value, values);
                  }}
                </OnChange>
              </div>
              <div className="col-6">
                <Field
                  component={InputText}
                  label="Nome da UE"
                  name="nome_unidade"
                  placeholder="Digite o nome da Unidade Educacional"
                  className="input-busca-produto"
                  disabled={desabilitarAluno}
                />
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-6">
                <Field
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
                      nome: "Aguardando cancelamento"
                    },
                    { uuid: "CANCELADA", nome: "Cancelada" },
                    { uuid: "DISTRIBUIDOR_CONFIRMA", nome: "Confirmada" },
                    { uuid: "DILOG_ACEITA_ALTERACAO", nome: "Alterada" },
                    {
                      uuid: "DISTRIBUIDOR_SOLICITA_ALTERACAO",
                      nome: "Em análise"
                    }
                  ]}
                  className="input-busca-produto"
                />
              </div>
            </div>
            <div className="mt-4 mb-4" ref={inicioResultado}>
              <Botao
                texto="Consultar"
                type={BUTTON_TYPE.SUBMIT}
                style={BUTTON_STYLE.GREEN}
                className="float-right ml-3"
                disabled={submitting}
              />

              <Botao
                texto="Limpar Filtros"
                type={BUTTON_TYPE.BUTTON}
                style={BUTTON_STYLE.GREEN_OUTLINE}
                className="float-right ml-3"
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
