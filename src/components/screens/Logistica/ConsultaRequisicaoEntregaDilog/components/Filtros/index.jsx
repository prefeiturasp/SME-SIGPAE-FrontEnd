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
import { debounce } from "lodash";
import MultiSelectDistribuidores from "src/components/Shareable/MultiSelectDistribuidores";

const FORM_NAME = "buscaRequisicoesDilog";

export default ({
  setFiltros,
  setSolicitacoes,
  initialValues,
  setInitialValues,
  inicioResultado,
}) => {
  const [desabilitarAluno, setDesabilitarAluno] = useState(false);

  const onSubmit = async (values) => {
    const filtros = { ...values };
    if (values.data_inicial)
      filtros.data_inicial = moment(values.data_inicial).format("DD/MM/YYYY");
    else delete filtros.data_inicial;
    if (values.data_final)
      filtros.data_final = moment(values.data_final).format("DD/MM/YYYY");
    else delete filtros.data_final;
    if (filtros.status === "Todos") delete filtros.status;
    setFiltros({ ...filtros });
  };

  const getNomeUnidadeEscola = async (codigo, formValues) => {
    const values = { ...formValues };
    if (codigo.length === 0) {
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

  const getNomeUnidadeEscolaDebounced = debounce(getNomeUnidadeEscola, 1000);

  return (
    <div className="filtros-requisicoes-dilog">
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
                  apenasNumeros
                  label="N° da Requisição de Entrega"
                  name="numero_requisicao"
                  placeholder="Digite o Nº da Requisição"
                  className="input-busca-produto"
                />
              </div>
              <div className="col-3">
                <Field
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
                  component={InputText}
                  label="Nome do Alimento"
                  name="nome_produto"
                  placeholder="Digite o nome do alimento"
                  className="input-busca-produto"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <MultiSelectDistribuidores
                  className="input-busca-produto"
                  name="distribuidor"
                  label="Nome dos Distribuidores"
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
            <div className="row">
              <div className="col-6">
                <Field
                  component={Select}
                  label="Status"
                  name="status"
                  placeholder="Status"
                  options={[
                    { uuid: "", nome: "Selecione" },
                    { uuid: undefined, nome: "Todos" },
                    { uuid: "AGUARDANDO_ENVIO", nome: "Aguardando envio" },
                    {
                      uuid: "AGUARDANDO_CANCELAMENTO",
                      nome: "Aguardando cancelamento",
                    },
                    { uuid: "DILOG_ENVIA", nome: "Enviada" },
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

                    getNomeUnidadeEscolaDebounced(value, values_);
                  }}
                />
              </div>
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
                  writable
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
                  writable
                />
              </div>
            </div>

            <div className="mt-4 mb-4" ref={inicioResultado}>
              <Botao
                texto="Consultar"
                type={BUTTON_TYPE.SUBMIT}
                style={BUTTON_STYLE.GREEN}
                className="float-end ms-3"
                disabled={submitting}
              />

              <Botao
                texto="Limpar Filtros"
                type={BUTTON_TYPE.BUTTON}
                style={BUTTON_STYLE.GREEN_OUTLINE}
                className="float-end ms-3"
                onClick={() => {
                  form.reset({});
                  setSolicitacoes(undefined);
                }}
              />
            </div>
          </form>
        )}
      />
    </div>
  );
};
