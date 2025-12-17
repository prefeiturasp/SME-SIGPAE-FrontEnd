import moment from "moment";
import React from "react";
import { Form, Field } from "react-final-form";
import { InputComData } from "src/components/Shareable/DatePicker";
import MultiSelect from "src/components/Shareable/FinalForm/MultiSelect";
import { InputText } from "src/components/Shareable/Input/InputText";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import "./style.scss";
import { montarMenuOptionStatus } from "../../helper";

export default ({
  setFiltros,
  setAlteracoesCronogramas,
  setTotal,
  fornecedor,
}) => {
  const onSubmit = async (values) => {
    const filtros = { ...values };
    if (filtros.motivos) {
      filtros.motivos = filtros.motivos.toString();
    }
    setFiltros({ ...filtros });
  };

  return (
    <div className="filtros-cronograma-de-entrega">
      <Form
        onSubmit={onSubmit}
        render={({ form, handleSubmit, submitting, values }) => (
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-6 mb-3">
                <Field
                  component={InputText}
                  label="N° do Cronograma"
                  name="numero_cronograma"
                  placeholder="Digite o n° do Cronograma"
                  className="input-busca-cronograma"
                />
              </div>
              {!fornecedor && (
                <div className="col-6 mb-3">
                  <Field
                    component={InputText}
                    label="Nome da Empresa"
                    name="fornecedor"
                    placeholder="Digite o nome da empresa"
                    className="input-busca-cronograma"
                  />
                </div>
              )}
              <div className="col-3 mb-3">
                <Field
                  component={InputComData}
                  label="Data da Solicitação"
                  name="data_after"
                  className="data-field-cronograma"
                  placeholder="De"
                  minDate={null}
                  maxDate={
                    values.data_before
                      ? moment(values.data_before, "DD/MM/YYYY")._d
                      : null
                  }
                />
              </div>
              <div className="col-3 mb-3">
                <Field
                  component={InputComData}
                  label="&nbsp;"
                  name="data_before"
                  className="data-field-cronograma"
                  popperPlacement="bottom-end"
                  placeholder="Até"
                  minDate={
                    values.data_after
                      ? moment(values.data_after, "DD/MM/YYYY")._d
                      : null
                  }
                  maxDate={null}
                />
              </div>
              <div className="col-6 mb-3">
                <Field
                  label="Status"
                  placeholder="Selecione um Status"
                  component={MultiSelect}
                  disableSearch
                  name="status"
                  multiple
                  nomeDoItemNoPlural="status"
                  pluralFeminino
                  options={montarMenuOptionStatus()}
                />
              </div>
            </div>

            <div className="mt-2 mb-4">
              <Botao
                texto="Filtrar"
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
                  setAlteracoesCronogramas(undefined);
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
