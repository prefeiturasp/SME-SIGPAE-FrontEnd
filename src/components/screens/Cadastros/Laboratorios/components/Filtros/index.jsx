import React from "react";
import { Form, Field } from "react-final-form";
import FinalFormToRedux from "src/components/Shareable/FinalFormToRedux";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import "./style.scss";
import AutoCompleteField from "src/components/Shareable/AutoCompleteField";
import SelectSelecione from "src/components/Shareable/SelectSelecione";
import { ehLaboratorioCredenciado } from "src/helpers/utilities";
import { getListaFiltradaAutoComplete } from "src/helpers/autoComplete";
import { NavLink } from "react-router-dom";
import {
  CADASTROS,
  CONFIGURACOES,
  CADASTRO_LABORATORIO,
} from "src/configs/constants";

const FORM_NAME = "laboratorios";

export default ({
  setFiltros,
  nomesLaboratorios,
  cnpjsLaboratorios,
  setResultado,
  setTotal,
}) => {
  const initialValues = {};

  const onSubmit = async (values) => {
    const filtros = { ...values };
    setFiltros({ ...filtros });
  };

  return (
    <div className="filtros-laboratorios">
      <Form
        onSubmit={onSubmit}
        initialValues={initialValues}
        render={({ form, handleSubmit, values }) => (
          <form onSubmit={handleSubmit}>
            <FinalFormToRedux form={FORM_NAME} />
            <div className="row">
              <div className="col-6">
                <Field
                  component={AutoCompleteField}
                  dataSource={getListaFiltradaAutoComplete(
                    nomesLaboratorios,
                    values.nome
                  )}
                  label="Nome do Laboratório"
                  name="nome"
                  placeholder="Digite o nome do Laboratório"
                  className="filtro-inputs-laboratorios"
                  toUppercaseActive
                />
              </div>
              <div className="col-3">
                <Field
                  component={AutoCompleteField}
                  dataSource={getListaFiltradaAutoComplete(
                    cnpjsLaboratorios,
                    values.cnpj
                  )}
                  label="CNPJ"
                  name="cnpj"
                  placeholder="Digite o CNPJ"
                  className="filtro-inputs-laboratorios"
                />
              </div>
              <div className="col-3">
                <Field
                  component={SelectSelecione}
                  naoDesabilitarPrimeiraOpcao
                  options={ehLaboratorioCredenciado}
                  label="Credenciado"
                  name="credenciado"
                  placeholder={"Selecione"}
                />
              </div>
            </div>

            <div className="mt-4 mb-4">
              <NavLink
                to={`/${CONFIGURACOES}/${CADASTROS}/${CADASTRO_LABORATORIO}`}
              >
                <Botao
                  texto="Cadastrar Laboratório"
                  type={BUTTON_TYPE.BUTTON}
                  style={BUTTON_STYLE.GREEN}
                  onClick={() => {}}
                  className="float-start"
                />
              </NavLink>

              <Botao
                texto="Filtrar"
                type={BUTTON_TYPE.SUBMIT}
                style={BUTTON_STYLE.GREEN}
                className="float-end ms-3"
              />

              <Botao
                texto="Limpar Filtros"
                type={BUTTON_TYPE.BUTTON}
                style={BUTTON_STYLE.GREEN_OUTLINE}
                className="float-end ms-3"
                onClick={() => {
                  form.reset({});
                  setResultado(undefined);
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
