import moment from "moment";
import React, { useState } from "react";
import { Form, Field } from "react-final-form";
import FinalFormToRedux from "src/components/Shareable/FinalFormToRedux";
import { InputComData } from "src/components/Shareable/DatePicker";
import { InputText } from "src/components/Shareable/Input/InputText";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import "./styles.scss";
import MultiSelectDistribuidores from "src/components/Shareable/MultiSelectDistribuidores";

const FORM_NAME = "entregasDilog";

export default ({
  setFiltros,
  setSolicitacoes,
  setTotal,
  dilog,
  dre,
  inicioResultado,
}) => {
  const [initialValues] = useState({});

  const onSubmit = async (values) => {
    const filtros = { ...values };
    setFiltros({ ...filtros });
  };
  return (
    <div className="filtros-entregas-dilog">
      <Form
        onSubmit={onSubmit}
        initialValues={initialValues}
        render={({ form, handleSubmit, submitting, values }) => (
          <form onSubmit={handleSubmit}>
            <FinalFormToRedux form={FORM_NAME} />
            <div className="row">
              <div className="col-6">
                <Field
                  component={InputText}
                  apenasNumeros
                  label="N° da Requisição de Entrega"
                  name="numero_requisicao"
                  placeholder="Digite o Nº da Requisição"
                  className="input-consulta-entregas"
                />
              </div>

              <div className="col-3">
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
              <div className="col-3">
                <Field
                  component={InputComData}
                  label="&nbsp;"
                  name="data_final"
                  className="data-final"
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

              {(dilog || dre) && (
                <div className="col-6 mt-1">
                  <MultiSelectDistribuidores
                    className="input-busca-distribuidores"
                    name="distribuidor"
                    label="Nome do Distribuidor"
                  />
                </div>
              )}

              {dre && (
                <div className="col-6 mt-1">
                  <Field
                    component={InputText}
                    label="Nome da UE"
                    name="nome_unidade"
                    placeholder="Digite o Nome da UE"
                    className="input-consulta-entregas"
                  />
                </div>
              )}
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
