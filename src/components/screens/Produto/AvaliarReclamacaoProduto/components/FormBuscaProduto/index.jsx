import React, { useEffect, useReducer } from "react";
import { Form, Field } from "react-final-form";
import { Row, Col } from "antd";
import AutoCompleteField from "src/components/Shareable/AutoCompleteField";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
  BUTTON_ICON,
} from "src/components/Shareable/Botao/constants";
import "./style.scss";
import { useNavigate } from "react-router-dom";

import {
  getAvaliarReclamacaoNomesProdutos,
  getAvaliarReclamacaoNomesMarcas,
  getAvaliarReclamacaoNomesFabricantes,
} from "src/services/produto.service";
import { SelectWithHideOptions } from "src/components/Shareable/SelectWithHideOptions";
import { STATUS_RECLAMACAO_PRODUTO } from "src/constants/shared";

const initialState = {
  dados: {},
  produtos: [],
  marcas: [],
  fabricantes: [],
  status: "",
  inicio: "",
};

function reducer(state, { type: actionType, payload }) {
  switch (actionType) {
    case "atualizarInicio":
      return { ...state, inicio: payload };
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
      throw new Error("Invalid action type: ", actionType);
  }
}

export const FormBuscaProduto = ({
  onSubmit,
  exibirBotaoVoltar,
  naoExibirLimparFiltros,
}) => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    const endpoints = [
      getAvaliarReclamacaoNomesProdutos("?filtrar_por=reclamacoes"),
      getAvaliarReclamacaoNomesMarcas("?filtrar_por=reclamacoes"),
      getAvaliarReclamacaoNomesFabricantes("?filtrar_por=reclamacoes"),
    ];
    async function fetchData() {
      Promise.all(endpoints).then(([produtos, marcas, fabricantes]) => {
        dispatch({
          type: "popularDados",
          payload: {
            produtos: produtos.data.results.map((el) => el.nome),
            marcas: marcas.data.results.map((el) => el.nome),
            fabricantes: fabricantes.data.results.map((el) => el.nome),
            status: STATUS_RECLAMACAO_PRODUTO,
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
      render={({ form, handleSubmit, submitting }) => (
        <form
          onSubmit={handleSubmit}
          className="busca-produtos-formulario-shared"
        >
          <Row>
            <Col>
              <Field
                component={AutoCompleteField}
                dataSource={state.produtos}
                label="Nome do Produto"
                className="input-busca-produto"
                onSearch={(v) => onSearch("produtos", v)}
                name="nome_produto"
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col md={24} lg={8}>
              <Field
                component={AutoCompleteField}
                dataSource={state.marcas}
                className="input-busca-produto"
                label="Marca do Produto"
                onSearch={(v) => onSearch("marcas", v)}
                name="nome_marca"
              />
            </Col>
            <Col md={24} lg={8}>
              <Field
                component={AutoCompleteField}
                dataSource={state.fabricantes}
                label="Fabricante do Produto"
                onSearch={(v) => onSearch("fabricantes", v)}
                name="nome_fabricante"
              />
            </Col>
            <Col md={24} lg={8}>
              <div className="pb-1">
                <label>Status</label>
              </div>
              <Field
                component={SelectWithHideOptions}
                mode="default"
                options={STATUS_RECLAMACAO_PRODUTO}
                name="status"
                handleChange={(v) => onSearch("status", v)}
                selectedItems={state.status}
              />
            </Col>
          </Row>
          <div className="row">
            <div className="col-12 text-end">
              {!!exibirBotaoVoltar && (
                <Botao
                  type={BUTTON_TYPE.BUTTON}
                  texto={"Voltar"}
                  className="me-3"
                  style={BUTTON_STYLE.BLUE_OUTLINE}
                  icon={BUTTON_ICON.ARROW_LEFT}
                  onClick={() => navigate(-1)}
                />
              )}
              {!naoExibirLimparFiltros && (
                <Botao
                  texto="Limpar Filtros"
                  type={BUTTON_TYPE.BUTTON}
                  className="me-3"
                  style={BUTTON_STYLE.GREEN_OUTLINE}
                  onClick={() => form.reset()}
                  disabled={submitting}
                />
              )}
              <Botao
                texto="Consultar"
                type={BUTTON_TYPE.SUBMIT}
                style={BUTTON_STYLE.GREEN}
                disabled={submitting}
              />
            </div>
          </div>
        </form>
      )}
    />
  );
};

export default FormBuscaProduto;
