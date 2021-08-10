import React, { useState, useEffect } from "react";
import HTTP_STATUS from "http-status-codes";

import { Form, Field } from "react-final-form";
import AutoCompleteFieldUnaccent from "components/Shareable/AutoCompleteField/unaccent";
import {
  BUTTON_TYPE,
  BUTTON_STYLE
} from "components/Shareable/Botao/constants";
import Botao from "components/Shareable/Botao";

import {
  getNomesProdutos,
  getMarcas,
  getFabricantes,
  filtrarReclamacoesEscola
} from "services/reclamacaoProduto.service";

import { formataOpcoes, formataPayload } from "./helpers.js";
import "./styles.scss";

const Filtros = ({
  setProdutos,
  setCarregando,
  setShowBuscaVazia,
  setTotal,
  setFiltros,
  setPage,
  PAGE_SIZE
}) => {
  const [opcoesNomesProdutos, setOpcoesNomesProdutos] = useState();
  const [opcoesMarcas, setOpcoesMarcas] = useState();
  const [opcoesFabricantes, setOpcoesFabricantes] = useState();

  const fetchData = async () => {
    const responseProdutos = await getNomesProdutos();
    if (responseProdutos.status === HTTP_STATUS.OK) {
      setOpcoesNomesProdutos(formataOpcoes(responseProdutos.data.results));
    }
    const responseMarcas = await getMarcas();
    if (responseMarcas.status === HTTP_STATUS.OK) {
      setOpcoesMarcas(formataOpcoes(responseMarcas.data.results));
    }
    const responseFabricantes = await getFabricantes();
    if (responseFabricantes.status === HTTP_STATUS.OK) {
      setOpcoesFabricantes(formataOpcoes(responseFabricantes.data.results));
    }
    setCarregando(false);
  };

  const onSubmit = async formValues => {
    let params = "";
    setProdutos(undefined);
    setCarregando(true);
    params = formataPayload(formValues);
    const response = await filtrarReclamacoesEscola(
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
                className="mr-3 botoesFiltro"
                type={BUTTON_TYPE.BUTTON}
                style={BUTTON_STYLE.GREEN_OUTLINE}
                onClick={() => {
                  form.reset();
                  setProdutos(undefined);
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
