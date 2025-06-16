import { Select } from "antd";
import moment from "moment";
import React, { useEffect, useReducer } from "react";
import { Form, Field } from "react-final-form";
import AutoCompleteField from "src/components/Shareable/AutoCompleteField";
import FinalFormToRedux from "src/components/Shareable/FinalFormToRedux";
import { ASelect } from "src/components/Shareable/MakeField";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import { InputComData } from "src/components/Shareable/DatePicker";

import {
  getNomesProdutos,
  getNomesMarcas,
  getNomesFabricantes,
} from "src/services/produto.service";

import { getOpcoesStatusReclamacao, getTodosStatusReclamacao } from "./helpers";
import "./styles.scss";

const initialState = {
  dados: {},
  status: ["Ativo", "Suspenso"],
  produtos: [],
  marcas: [],
  fabricantes: [],
  opcoesStatusReclamacao: [],
  dataMinima: null,
  dataMaxima: null,
  statusReclamacaoPadrao: "Selecione",
};

const FORM_NAME = "buscaAvancadaProduto";

function reducer(state, { type: actionType, payload }) {
  switch (actionType) {
    case "popularDados":
      return { ...state, dados: payload };
    case "atualizarFiltro": {
      if (!payload.searchText.length) {
        return { ...state, [payload.filtro]: [] };
      }
      const reg = new RegExp(payload.searchText, "i");
      const filtrado = state.dados[payload.filtro].filter((el) => reg.test(el));
      return { ...state, [payload.filtro]: filtrado };
    }
    case "resetar":
      return { ...initialState, dados: state.dados };
    default:
      // eslint-disable-next-line no-console
      console.error("Invalid action type: ", actionType);
  }
}

const FormBuscaProduto = ({ setFiltros, setPage }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { Option } = Select;

  useEffect(() => {
    async function fetchData() {
      Promise.all([
        getNomesProdutos(),
        getNomesMarcas(),
        getNomesFabricantes(),
      ]).then(([produtos, marcas, fabricantes]) => {
        dispatch({
          type: "popularDados",
          payload: {
            produtos: produtos.data.results.map((el) => el.nome),
            marcas: marcas.data.results.map((el) => el.nome),
            fabricantes: fabricantes.data.results.map((el) => el.nome),
          },
        });
      });
    }
    fetchData();
  }, []);

  const onSearch = (filtro, searchText) => {
    dispatch({
      type: "atualizarFiltro",
      payload: {
        filtro,
        searchText,
      },
    });
  };

  const opcoesStatusReclamacao = () => {
    return getOpcoesStatusReclamacao().map((item, index) => {
      return (
        <Option disabled={item.disabled} key={index} value={item.value}>
          {item.option}
        </Option>
      );
    });
  };

  const onSubmit = (values) => {
    let formValues = null;
    if (values.status_reclamacao === "Selecione")
      formValues = { ...values, status_reclamacao: getTodosStatusReclamacao() };
    else
      formValues = { ...values, status_reclamacao: [values.status_reclamacao] };
    setPage(1);
    setFiltros(formValues);
  };

  return (
    <Form
      onSubmit={onSubmit}
      render={({ form, handleSubmit, submitting, values }) => (
        <form onSubmit={handleSubmit} className="busca-produtos">
          <FinalFormToRedux form={FORM_NAME} />
          <div className="form-row">
            <div className="col-md-6 col-xl-6 input-busca-nome">
              <Field
                component={AutoCompleteField}
                dataSource={state.produtos}
                label="Nome do Produto"
                placeholder="Digite nome do produto"
                className="input-busca-produto"
                onSearch={(v) => onSearch("produtos", v)}
                name="nome_produto"
              />
            </div>
            <div className="col-md-6 col-xl-6 mb-0">
              <label className="">Status</label>
              <Field
                component={ASelect}
                name="status_reclamacao"
                className="input-busca-produto"
                defaultValue={state.statusReclamacaoPadrao}
              >
                {opcoesStatusReclamacao()}
              </Field>
            </div>
          </div>
          <div className="form-row">
            <div className="col-md-4 col-xl-4">
              <Field
                component={AutoCompleteField}
                dataSource={state.marcas}
                className="input-busca-produto"
                label="Marca do Produto"
                placeholder="Digite marca do produto"
                onSearch={(v) => onSearch("marcas", v)}
                name="nome_marca"
              />
            </div>
            <div className="col-md-4 col-xl-4">
              <Field
                component={AutoCompleteField}
                dataSource={state.fabricantes}
                label="Fabricante do Produto"
                placeholder="Digite fabricante do produto"
                onSearch={(v) => onSearch("fabricantes", v)}
                name="nome_fabricante"
              />
            </div>

            <div className="col-12 col-md-4 col-xl-4">
              <div className="row">
                <label className="ms-3">Data da reclamação</label>
              </div>
              <div className="row">
                <div className="col mt-1">
                  <Field
                    component={InputComData}
                    name="data_inicial_reclamacao"
                    className="data-inicial"
                    labelClassName="datepicker-fixed-padding"
                    placeholder="De"
                    minDate={null}
                    maxDate={
                      values.data_final_reclamacao
                        ? moment(values.data_final_reclamacao, "DD/MM/YYYY")._d
                        : moment()._d
                    }
                  />
                </div>
                <div className="col mt-1">
                  <Field
                    component={InputComData}
                    name="data_final_reclamacao"
                    labelClassName="datepicker-fixed-padding"
                    popperPlacement="bottom-end"
                    placeholder="Até"
                    minDate={
                      values.data_inicial_reclamacao
                        ? moment(values.data_inicial_reclamacao, "DD/MM/YYYY")
                            ._d
                        : null
                    }
                    maxDate={moment()._d}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 mb-4">
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
              disabled={submitting}
              onClick={() => {
                form.reset({ status_reclamacao: state.statusReclamacaoPadrao });
              }}
            />
          </div>
        </form>
      )}
    />
  );
};

export default FormBuscaProduto;
