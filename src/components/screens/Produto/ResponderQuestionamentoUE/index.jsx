import React, { useState } from "react";
import { Spin, Pagination } from "antd";
import { toastError } from "components/Shareable/Toast/dialogs";

import Filtros from "./components/Filtros";
import TabelaProdutos from "./components/TabelaProdutos";

import { filtrarReclamacoesEscola } from "services/reclamacaoProduto.service";

const ResponderQuestionamentoUE = () => {
  const [exibirModal, setExibirModal] = useState();
  const [produtos, setProdutos] = useState();
  const [carregando, setCarregando] = useState();
  const [showBuscaVazia, setShowBuscaVazia] = useState(false);
  const [filtros, setFiltros] = useState();
  const [total, setTotal] = useState();
  const [page, setPage] = useState();

  const changePage = async page => {
    try {
      setCarregando(true);
      const response = await filtrarReclamacoesEscola(
        `${filtros}&page=${page}`
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
              />,
              <Pagination
                className="mt-3 mb-3"
                key={2}
                current={page || 1}
                total={total}
                showSizeChanger={false}
                onChange={page => {
                  setPage(page);
                  changePage(page);
                }}
                pageSize={10}
              />
            ]}
          </Spin>
        </div>
      </div>
    </>
  );
};

export default ResponderQuestionamentoUE;
