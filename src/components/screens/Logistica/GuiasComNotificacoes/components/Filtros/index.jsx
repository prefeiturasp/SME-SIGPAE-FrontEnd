import React from "react";
import { Form, Field } from "react-final-form";
import FinalFormToRedux from "src/components/Shareable/FinalFormToRedux";
import { InputText } from "src/components/Shareable/Input/InputText";
import MultiSelect from "src/components/Shareable/FinalForm/MultiSelect";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import "./style.scss";
import SelectSelecione from "src/components/Shareable/SelectSelecione";
import { useState } from "react";
import { getNomesDistribuidores } from "src/services/logistica.service";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { CADASTRO_NOTIFICACAO, LOGISTICA } from "src/configs/constants";

const FORM_NAME = "guiasOcorrencias";

export default ({ setFiltros, setNotificacoes, fiscal, somenteLeitura }) => {
  const [distribuidores, setDistribuidores] = useState([]);

  const initialValues = {};

  const onSubmit = async (values) => {
    const filtros = { ...values };
    setFiltros({ ...filtros });
  };

  useEffect(() => {
    const buscaDistribuidores = async () => {
      const response = await getNomesDistribuidores();
      setDistribuidores(
        response.data.results.map((distribuidor) => ({
          nome: distribuidor.nome_fantasia,
          uuid: distribuidor.uuid,
        }))
      );
    };

    buscaDistribuidores();
  }, []);

  return (
    <div className="filtros-guias-notificacoes">
      <Form
        onSubmit={onSubmit}
        initialValues={initialValues}
        render={({ form, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <FinalFormToRedux form={FORM_NAME} />
            <div className="row">
              <div className="col-6">
                <Field
                  component={InputText}
                  label="Nº da Notificação"
                  name="numero"
                  placeholder="Digite o Nº da Notificação"
                  className="input-numero-notificacao"
                />
              </div>
              <div className="col-6">
                <Field
                  component={SelectSelecione}
                  naoDesabilitarPrimeiraOpcao
                  options={distribuidores}
                  label="Empresa"
                  name="empresa"
                  placeholder={"Selecione uma Empresa"}
                  classe="input-numero-notificacao"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Field
                  label="Status da Notificação"
                  component={MultiSelect}
                  disableSearch
                  name="status"
                  multiple
                  nomeDoItemNoPlural="status"
                  options={[
                    {
                      value: "RASCUNHO",
                      label: "Rascunho",
                    },
                  ]}
                  placeholder="Selecione o Status da Notificação"
                  className="input-numero-notificacao"
                />
              </div>
              <div className="col-6">
                <Field
                  component={InputText}
                  label="Nº do Processo SEI"
                  name="processo_sei"
                  placeholder="Digite o Nº SEI"
                  className="input-numero-notificacao"
                />
              </div>
            </div>

            <div className="mt-4 mb-4">
              {fiscal === false && somenteLeitura === false && (
                <NavLink to={`/${LOGISTICA}/${CADASTRO_NOTIFICACAO}`}>
                  <Botao
                    texto="Nova Notificação"
                    type={BUTTON_TYPE.BUTTON}
                    style={BUTTON_STYLE.GREEN}
                    onClick={() => {}}
                    className="float-start"
                  />
                </NavLink>
              )}

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
                  setNotificacoes(undefined);
                }}
              />
            </div>
          </form>
        )}
      />
    </div>
  );
};
