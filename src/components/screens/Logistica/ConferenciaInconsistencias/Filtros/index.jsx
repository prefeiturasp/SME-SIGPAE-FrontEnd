import React from "react";
import { Form, Field } from "react-final-form";
import FinalFormToRedux from "src/components/Shareable/FinalFormToRedux";
import { InputText } from "src/components/Shareable/Input/InputText";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import "./style.scss";

const FORM_NAME = "buscaGuiaInconsistencias";

export default ({ setFiltros, setGuias, setTotal, inicioResultado }) => {
  const onSubmit = async (values) => {
    const filtros = { ...values };
    if (filtros.motivos) {
      filtros.motivos = filtros.motivos.toString();
    }
    setFiltros({ ...filtros });
  };

  return (
    <div className="filtros-inconsistencias">
      <Form
        onSubmit={onSubmit}
        render={({ form, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <FinalFormToRedux form={FORM_NAME} />
            <div className="row">
              <div className="col-3">
                <Field
                  component={InputText}
                  label="N° da Guia de Remessa"
                  name="numero_guia"
                  apenasNumeros
                  placeholder="Digite o Nº da Guia"
                  className="input-busca-produto"
                />
              </div>
              <div className="col-3">
                <Field
                  component={InputText}
                  label="Código CODAE"
                  name="codigo_unidade"
                  apenasNumeros
                  placeholder="Digite o Código da UE"
                  className="input-busca-produto"
                />
              </div>
              <div className="col-6">
                <Field
                  component={InputText}
                  label="Nome da UE"
                  name="nome_unidade"
                  placeholder="Digite o Nome da UE"
                  className="input-busca-produto"
                />
              </div>
            </div>

            <div className="mt-4 mb-4" ref={inicioResultado}>
              <Botao
                texto="Consultar"
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
                  setGuias(undefined);
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
