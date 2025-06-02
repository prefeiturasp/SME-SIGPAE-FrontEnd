import React, { useState, useEffect } from "react";
import { Spin } from "antd";
import { toastError } from "src/components/Shareable/Toast/dialogs";

import Filtros from "./components/Filtros";
import TabelaProdutos from "./components/TabelaProdutos";

import { filtrarReclamacoesNutrisupervisor } from "src/services/reclamacaoProduto.service";
import { Paginacao } from "src/components/Shareable/Paginacao";

const ResponderQuestionamentoNutrisupervisor = () => {
  const [exibirModal, setExibirModal] = useState();
  const [produtos, setProdutos] = useState();
  const [carregando, setCarregando] = useState();
  const [showBuscaVazia, setShowBuscaVazia] = useState(false);
  const [filtradoPorParametro, setFiltradoPorParametro] = useState(false);
  const [filtros, setFiltros] = useState();
  const [total, setTotal] = useState();
  const [page, setPage] = useState();
  const PAGE_SIZE = 10;

  const parameters = new URLSearchParams(window.location.search);
  const nome_produto = parameters.get("nome_produto");

  useEffect(() => {
    if (nome_produto) {
      setFiltradoPorParametro(true);
    }
  }, [nome_produto]);

  const changePage = async (page) => {
    try {
      setCarregando(true);
      const response = await filtrarReclamacoesNutrisupervisor(
        `${filtros}&page=${page}&page_size=${PAGE_SIZE}`
      );
      if (response.count > 0) {
        setPage(page);
        setProdutos(response.results);
        setShowBuscaVazia(false);
      } else {
        setShowBuscaVazia(true);
      }
    } catch (e) {
      toastError("Houve um erro ao tentar trocar página");
    }
    setCarregando(false);
  };

  return (
    <>
      <div className="card mt-3">
        <div className="card-body">
          <Spin tip="Carregando..." spinning={carregando}>
            <Filtros
              setProdutos={setProdutos}
              setCarregando={setCarregando}
              setShowBuscaVazia={setShowBuscaVazia}
              setTotal={setTotal}
              setPage={setPage}
              PAGE_SIZE={PAGE_SIZE}
              setFiltros={setFiltros}
            />
            {showBuscaVazia && (
              <div className="text-center mt-3 ">
                Nenhum resultado encontrado
              </div>
            )}
            {produtos && [
              <TabelaProdutos
                produtos={produtos}
                key={1}
                exibirModal={exibirModal}
                setExibirModal={setExibirModal}
                setCarregando={setCarregando}
                filtros={filtros}
                setTotal={setTotal}
                setProdutos={setProdutos}
                setShowBuscaVazia={setShowBuscaVazia}
                filtradoPorParametro={filtradoPorParametro}
              />,
              <Paginacao
                className="mt-3 mb-3"
                key={2}
                current={page || 1}
                total={total}
                showSizeChanger={false}
                onChange={(page) => {
                  setPage(page);
                  changePage(page);
                }}
                pageSize={10}
              />,
            ]}
          </Spin>
        </div>
      </div>
    </>
  );
};

export default ResponderQuestionamentoNutrisupervisor;
