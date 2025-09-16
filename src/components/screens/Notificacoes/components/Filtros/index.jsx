import moment from "moment";
import React, { useRef } from "react";
import { Form, Field } from "react-final-form";
import FinalFormToRedux from "src/components/Shareable/FinalFormToRedux";
import { InputComData } from "src/components/Shareable/DatePicker";
import { InputText } from "src/components/Shareable/Input/InputText";
import MultiSelect from "src/components/Shareable/FinalForm/MultiSelect";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import "./style.scss";

const FORM_NAME = "buscaNotificações";

export default ({ filtros, setFiltros }) => {
  const initialValues = {};
  const inicioResultado = useRef();

  const onSubmit = async (values) => {
    const filtros = { ...values };
    if (filtros.data_inicial)
      filtros.data_inicial = moment(filtros.data_inicial).format("DD/MM/YYYY");
    if (filtros.data_final)
      filtros.data_final = moment(filtros.data_final).format("DD/MM/YYYY");
    setFiltros({ ...filtros });
  };

  const handleClickBtnCategorias = async (e) => {
    const filtrosNovo = { ...filtros };
    if (e === "todos") {
      delete filtrosNovo.lido;
    } else if (e === "nao_lidas") {
      filtrosNovo.lido = false;
    } else if (e === "lidas") {
      filtrosNovo.lido = true;
    }
    setFiltros({ ...filtrosNovo });
  };

  return (
    <div className="filtros-notificacoes">
      <div
        className="btn-group btn-group-toggle container-btn-broup-categorias mt-3"
        data-toggle="buttons"
      >
        <label
          onClick={() => handleClickBtnCategorias("todos")}
          className="btn btn-outline-light active"
        >
          <input type="radio" name="options" id="todas" defaultChecked={true} />{" "}
          Todas
        </label>
        <label
          onClick={() => handleClickBtnCategorias("nao_lidas")}
          className="btn btn-outline-light"
        >
          <input type="radio" name="options" id="nao_lidas" /> Não Lidas
        </label>
        <label
          onClick={() => handleClickBtnCategorias("lidas")}
          className="btn btn-outline-light"
        >
          <input type="radio" name="options" id="lidas" /> Lidas
        </label>
      </div>
      <Form
        onSubmit={onSubmit}
        initialValues={initialValues}
        render={({ form, handleSubmit, submitting, values }) => (
          <form onSubmit={handleSubmit}>
            <FinalFormToRedux form={FORM_NAME} />
            <div className="row">
              <div className="col-6">
                <Field
                  dataTestId="input-tema"
                  component={InputText}
                  label="Tema"
                  name="categoria"
                  placeholder="Escreva uma palavra"
                  className="input-busca-produto"
                />
              </div>
              <div className="col-6">
                <Field
                  label="Tipo"
                  component={MultiSelect}
                  disableSearch
                  name="tipo"
                  multiple
                  nomeDoItemNoPlural="tipos"
                  options={[
                    {
                      value: "ALERTA",
                      label: "Alerta",
                    },
                    {
                      value: "AVISO",
                      label: "Aviso",
                    },
                    {
                      value: "PENDENCIA",
                      label: "Pendência",
                    },
                  ]}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-3">
                <Field
                  dataTestId="data-inicial"
                  component={InputComData}
                  label="Período"
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
              <div className="col-3">
                <Field
                  dataTestId="data-final"
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
