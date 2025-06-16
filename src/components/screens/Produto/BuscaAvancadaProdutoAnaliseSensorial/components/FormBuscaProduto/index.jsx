import React, { useEffect, useReducer } from "react";
import moment from "moment";
import { Form, Field } from "react-final-form";
import AutoCompleteField from "src/components/Shareable/AutoCompleteField";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import {
  getNomesProdutos,
  getNomesMarcas,
  getNomesFabricantes,
  getNomesTerceirizadas,
} from "src/services/produto.service";
import { InputComData } from "src/components/Shareable/DatePicker";
import "./style.scss";

const initialState = {
  dados: {},
  status: ["Ativo", "Suspenso"],
  produtos: [],
  marcas: [],
  fabricantes: [],
  dataMinima: null,
  dataMaxima: null,
};

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

const FormBuscaProduto = ({ onSubmit }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    async function fetchData() {
      Promise.all([
        getNomesProdutos(),
        getNomesMarcas(),
        getNomesFabricantes(),
        getNomesTerceirizadas(),
      ]).then(([produtos, marcas, fabricantes, terceirizadas]) => {
        dispatch({
          type: "popularDados",
          payload: {
            produtos: produtos.data.results.map((el) => el.nome),
            marcas: marcas.data.results.map((el) => el.nome),
            fabricantes: fabricantes.data.results.map((el) => el.nome),
            terceirizadas: terceirizadas.data.results.map(
              (el) => el.nome_fantasia
            ),
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

  return (
    <Form
      onSubmit={onSubmit}
      render={({ form, handleSubmit, values }) => (
        <form onSubmit={handleSubmit} className="busca-produtos-ativacao">
          <div className="form-row">
            <div className="col-md-6 col-xl-6">
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
            <div className="col-md-6 col-xl-6">
              <Field
                component={AutoCompleteField}
                dataSource={state.terceirizadas}
                label="Nome da empresa solicitante (Terceirizada)"
                placeholder="Digite nome da terceirizada"
                onSearch={(v) => onSearch("terceirizadas", v)}
                name="nome_terceirizada"
              />
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
                <label className="ms-3">Data análise sensorial</label>
              </div>
              <div className="row">
                <div className="col mt-1">
                  <Field
                    component={InputComData}
                    name="data_analise_inicial"
                    className="data-inicial"
                    labelClassName="datepicker-fixed-padding"
                    placeholder="De"
                    minDate={null}
                    maxDate={
                      values.data_analise_final
                        ? moment(values.data_analise_final, "DD/MM/YYYY")._d
                        : moment()._d
                    }
                  />
                </div>
                <div className="col mt-1">
                  <Field
                    component={InputComData}
                    name="data_analise_final"
                    labelClassName="datepicker-fixed-padding"
                    popperPlacement="bottom-end"
                    placeholder="Até"
                    minDate={
                      values.data_analise_inicial
                        ? moment(values.data_analise_inicial, "DD/MM/YYYY")._d
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
            />

            <Botao
              texto="Limpar Filtros"
              type={BUTTON_TYPE.BUTTON}
              style={BUTTON_STYLE.GREEN_OUTLINE}
              className="float-end ms-3"
              onClick={() => form.reset()}
            />
          </div>
        </form>
      )}
    />
  );
};

export default FormBuscaProduto;
