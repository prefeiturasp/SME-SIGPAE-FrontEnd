import { Spin } from "antd";
import HTTP_STATUS from "http-status-codes";
import React, { useState, useEffect } from "react";
import FormBuscaSolicitacao from "./components/FormBuscaSolicitacoes";
import ListagemProdutos from "./components/ListagemSolicitacoes";
import { getSolicitacoesCadastroProdutoDieta } from "src/services/produto.service";
import "./styles.scss";
import { Paginacao } from "src/components/Shareable/Paginacao";

export default () => {
  const [ativos, setAtivos] = useState(undefined);
  const [solicitacoes, setSolicitacoes] = useState(undefined);
  const [totalSolicitacoes, setTotalSolicitacoes] = useState(0);
  const [page, setPage] = useState(1);
  const [formValues, setFormValues] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const PAGE_SIZE = 10;

  const fetchData = async () => {
    setCarregando(true);
    const resposta = await getSolicitacoesCadastroProdutoDieta({
      ...formValues,
      page: page,
      page_size: PAGE_SIZE,
    });
    if (resposta.status === HTTP_STATUS.OK) {
      setSolicitacoes(resposta.data.results);
      setTotalSolicitacoes(resposta.data.count);
    }
    setCarregando(false);
  };

  useEffect(() => {
    if (formValues) fetchData();
  }, [formValues, page]);

  const onSubmit = async (values) => {
    setFormValues({ ...values });
  };

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 avaliar-solicitacao-cadastro-produto">
        <div className="card-body ">
          <FormBuscaSolicitacao onSubmit={onSubmit} />
          {solicitacoes && solicitacoes.length > 0 && (
            <>
              <ListagemProdutos
                solicitacoes={solicitacoes}
                setSolicitacoes={setSolicitacoes}
                ativos={ativos}
                setAtivos={setAtivos}
              />
              <Paginacao
                className="mt-3 mb-3"
                current={page || 1}
                total={totalSolicitacoes}
                showSizeChanger={false}
                onChange={(page) => {
                  setPage(page);
                }}
                pageSize={PAGE_SIZE}
              />
            </>
          )}
          {solicitacoes && solicitacoes.length === 0 && (
            <div className="text-center mt-5">
              Não existem dados para filtragem informada.
            </div>
          )}
        </div>
      </div>
    </Spin>
  );
};
