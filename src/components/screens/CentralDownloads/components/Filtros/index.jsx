import moment from "moment";
import React, { useRef } from "react";
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
import {
  OPTIONS_STATUS_DOWNLOAD,
  OPTIONS_VISTO_DOWNLOAD,
} from "src/constants/shared";
import Select from "src/components/Shareable/Select";

const FORM_NAME = "buscaDownloads";

export default ({ setFiltros }) => {
  const initialValues = {};
  const inicioResultado = useRef();

  const onSubmit = async (values) => {
    const filtros = { ...values };
    if (filtros.data_geracao)
      filtros.data_geracao = moment(filtros.data_geracao).format("DD/MM/YYYY");
    setFiltros({ ...filtros });
  };
  return (
    <div className="filtros-downloads">
      <Form
        onSubmit={onSubmit}
        initialValues={initialValues}
        render={({ form, handleSubmit, submitting }) => (
          <form onSubmit={handleSubmit}>
            <FinalFormToRedux form={FORM_NAME} />

            <div className="row">
              <div className="col-3">
                <Field
                  component={InputText}
                  label="Identificador"
                  name="identificador"
                  placeholder="Escreva uma palavra"
                  className="input-busca-produto"
                />
              </div>

              <div className="col-3">
                <Field
                  label="Status"
                  component={Select}
                  placeholder="Selecione o Status"
                  name="status"
                  options={OPTIONS_STATUS_DOWNLOAD}
                  dataTestId="select-status"
                />
              </div>
              <div className="col-3">
                <Field
                  component={InputComData}
                  label="Data de Criação"
                  name="data_geracao"
                  placeholder="Selecione a Data"
                  minDate={null}
                  maxDate={null}
                  writable
                />
              </div>
              <div className="col-3">
                <Field
                  label="Visto"
                  component={Select}
                  placeholder="Selecione"
                  name="visto"
                  options={OPTIONS_VISTO_DOWNLOAD}
                  dataTestId="select-visto"
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
                onClick={() => inicioResultado.current.scrollIntoView()}
              />

              <Botao
                texto="Limpar Filtros"
                type={BUTTON_TYPE.BUTTON}
                style={BUTTON_STYLE.GREEN_OUTLINE}
                className="float-end ms-3"
                onClick={() => {
                  form.reset(initialValues);
                  setFiltros(initialValues);
                }}
              />
            </div>
          </form>
        )}
      />
    </div>
  );
};
