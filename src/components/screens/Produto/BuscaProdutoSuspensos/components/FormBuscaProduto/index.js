import React, { useEffect, useReducer } from "react";
import { Form, Field } from "react-final-form";
import AutoCompleteField from "components/Shareable/AutoCompleteField";
import { dateDelta } from "helpers/utilities";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "components/Shareable/Botao/constants";
import {
  getNomesProdutos,
  getNomesMarcas,
  getNomesFabricantes,
  getNomesTerceirizadas,
  getNomesUnicosEditais,
} from "services/produto.service";
import { InputComData } from "components/Shareable/DatePicker";
import "./style.scss";
import { required } from "helpers/fieldValidators";

const initialState = {
  dados: {},
  status: ["Ativo", "Suspenso"],
  produtos: [],
  marcas: [],
  fabricantes: [],
  tipos: ["Comum", "Dieta especial"],
  editais: [],
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

const FormBuscaProduto = ({ onSubmit, bloquearEdital, initialStateForm }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    async function fetchData() {
      Promise.all([
        getNomesProdutos(),
        getNomesMarcas(),
        getNomesFabricantes(),
        getNomesTerceirizadas(),
        getNomesUnicosEditais(),
      ]).then(([produtos, marcas, fabricantes, terceirizadas, editais]) => {
        dispatch({
          type: "popularDados",
          payload: {
            produtos: produtos.data.results.map((el) => el.nome),
            marcas: marcas.data.results.map((el) => el.nome),
            fabricantes: fabricantes.data.results.map((el) => el.nome),
            terceirizadas: terceirizadas.data.results.map(
              (el) => el.nome_fantasia
            ),
            tipos: ["Comum", "Dieta especial"],
            editais: editais.data.results,
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
      initialValues={initialStateForm}
      render={({ form, handleSubmit, submitting }) => (
        <form onSubmit={handleSubmit} className="busca-produtos-ativacao">
          <div className="form-row">
            <div className="col-md-6 col-xl-6">
              <Field
                component={AutoCompleteField}
                dataSource={state.editais}
                label="Edital"
                placeholder="Digite edital"
                className="input-busca-produto"
                onSearch={(v) => onSearch("editais", v)}
                name="nome_edital"
                disabled={bloquearEdital}
                validate={required}
                required
              />
            </div>
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
          </div>
          <div className="form-row">
            <div className="col-md-6 col-xl-6">
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
            <div className="col-md-6 col-xl-6">
              <Field
                component={AutoCompleteField}
                dataSource={state.fabricantes}
                label="Fabricante do Produto"
                placeholder="Digite fabricante do produto"
                onSearch={(v) => onSearch("fabricantes", v)}
                name="nome_fabricante"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="col-md-6 col-xl-6">
              <Field
                component={AutoCompleteField}
                dataSource={state.tipos}
                label="Tipo"
                placeholder="Selecione um tipo"
                className="input-busca-produto"
                onSearch={(v) => onSearch("tipos", v)}
                name="tipo"
              />
            </div>
            <div className="col-12 col-md-6 col-xl-6">
              <Field
                component={InputComData}
                name="data_suspensao_final"
                label="Suspensos até"
                minDate={false}
                maxDate={dateDelta(0)}
                popperPlacement="bottom-end"
              />
            </div>
          </div>
          <div className="mt-4 mb-4">
            <Botao
              texto="Consultar"
              type={BUTTON_TYPE.SUBMIT}
              style={BUTTON_STYLE.GREEN}
              className="float-end ml-3"
              disabled={submitting}
            />

            <Botao
              texto="Limpar Filtros"
              type={BUTTON_TYPE.BUTTON}
              style={BUTTON_STYLE.GREEN_OUTLINE}
              className="float-end ml-3"
              onClick={() => form.reset()}
              disabled={submitting}
            />
          </div>
        </form>
      )}
    />
  );
};

export default FormBuscaProduto;
