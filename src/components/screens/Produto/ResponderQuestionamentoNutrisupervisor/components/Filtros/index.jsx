import React, { useState, useEffect } from "react";
import HTTP_STATUS from "http-status-codes";

import { Form, Field } from "react-final-form";
import AutoCompleteFieldUnaccent from "src/components/Shareable/AutoCompleteField/unaccent";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import Botao from "src/components/Shareable/Botao";

import {
  getNomesProdutosNutrisupervisor,
  getMarcasNutrisupervisor,
  getFabricantesNutrisupervisor,
  filtrarReclamacoesNutrisupervisor,
} from "src/services/reclamacaoProduto.service";

import { formataOpcoes, formataPayload } from "./helpers";
import "./styles.scss";

const Filtros = ({
  setProdutos,
  setCarregando,
  setShowBuscaVazia,
  setTotal,
  setFiltros,
  setPage,
  PAGE_SIZE,
}) => {
  const [opcoesNomesProdutos, setOpcoesNomesProdutos] = useState();
  const [opcoesMarcas, setOpcoesMarcas] = useState();
  const [opcoesFabricantes, setOpcoesFabricantes] = useState();

  const parameters = new URLSearchParams(window.location.search);
  const nome_produto_param = parameters.get("nome_produto");

  const fetchData = async () => {
    const responseProdutos = await getNomesProdutosNutrisupervisor();
    if (responseProdutos.status === HTTP_STATUS.OK) {
      setOpcoesNomesProdutos(formataOpcoes(responseProdutos.data.results));
    }
    const responseMarcas = await getMarcasNutrisupervisor();
    if (responseMarcas.status === HTTP_STATUS.OK) {
      setOpcoesMarcas(formataOpcoes(responseMarcas.data.results));
    }
    const responseFabricantes = await getFabricantesNutrisupervisor();
    if (responseFabricantes.status === HTTP_STATUS.OK) {
      setOpcoesFabricantes(formataOpcoes(responseFabricantes.data.results));
    }
    if (nome_produto_param) {
      const responseProdutosFiltrados = await filtrarReclamacoesNutrisupervisor(
        `?nome_produto=${nome_produto_param}&page=1&page_size=${PAGE_SIZE}`
      );
      if (responseProdutosFiltrados) {
        setProdutos(responseProdutosFiltrados.results);
        setTotal(responseProdutosFiltrados.count);
        setPage(1);
        setCarregando(false);
        return;
      }
    }
    setCarregando(false);
  };

  const onSubmit = async (formValues) => {
    window.history.replaceState(null, null, window.location.pathname);
    let params = "";
    setProdutos(undefined);
    setCarregando(true);
    params = formataPayload(formValues);
    const response = await filtrarReclamacoesNutrisupervisor(
      `${params}&page=1&page_size=${PAGE_SIZE}`
    );
    if (response.count > 0) {
      setProdutos(response.results);
      setTotal(response.count);
      setFiltros(params);
      setShowBuscaVazia(false);
    } else {
      setShowBuscaVazia(true);
    }
    setCarregando(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Form
      onSubmit={onSubmit}
      render={({ form, handleSubmit, submitting }) => (
        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col-12">
              <Field
                component={AutoCompleteFieldUnaccent}
                dataSource={opcoesNomesProdutos}
                label="Nome do Produto"
                placeholder="Digite o nome do produto"
                name="nome_produto"
              />
            </div>
            <div className="col-6">
              <Field
                component={AutoCompleteFieldUnaccent}
                dataSource={opcoesMarcas}
                label="Marca do Produto"
                placeholder="Digite a marca do produto"
                name="nome_marca"
              />
            </div>
            <div className="col-6">
              <Field
                component={AutoCompleteFieldUnaccent}
                dataSource={opcoesFabricantes}
                label="Fabricante do Produto"
                placeholder="Digite o fabricante do produto"
                name="nome_fabricante"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <Botao
                texto="Consultar"
                className="botoesFiltro"
                type={BUTTON_TYPE.SUBMIT}
                style={BUTTON_STYLE.GREEN}
                disabled={submitting}
              />
              <Botao
                texto="Limpar Filtros"
                className="me-3 botoesFiltro"
                type={BUTTON_TYPE.BUTTON}
                style={BUTTON_STYLE.GREEN_OUTLINE}
                onClick={() => {
                  form.reset();
                  setProdutos(undefined);
                  setShowBuscaVazia(false);
                  setFiltros(undefined);
                  setPage(1);
                }}
                disabled={submitting}
              />
            </div>
          </div>
        </form>
      )}
    />
  );
};

export default Filtros;
