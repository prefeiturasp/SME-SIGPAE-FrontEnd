import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import HTTP_STATUS from "http-status-codes";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import {
  getNomesProdutosEdital,
  getCadastroProdutosEdital,
} from "src/services/produto.service";
import Filtros from "./componentes/Filtros";
import Tabela from "./componentes/Tabela";
import "./style.scss";
import { tipoStatus } from "src/helpers/utilities";
import { Paginacao } from "src/components/Shareable/Paginacao";

export default () => {
  const [carregando, setCarregando] = useState(true);
  const [resultado, setResultado] = useState(undefined);
  const [nomes, setNomes] = useState(undefined);
  const [status, setStatus] = useState(undefined);
  const [total, setTotal] = useState(0);
  const [filtros, setFiltros] = useState({});
  const [page, setPage] = useState(1);

  async function fetchData() {
    const respNomes = await getNomesProdutosEdital();
    const respProdutos = await getCadastroProdutosEdital({});
    setNomes(respNomes.data.results);
    setStatus(tipoStatus);
    setResultado(respProdutos.data.results);
    setTotal(respProdutos.data.count);
    setCarregando(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const changePage = async (page) => {
    try {
      setCarregando(true);
      let payload = filtros;
      payload["page"] = page;
      const response = await getCadastroProdutosEdital(payload);
      if (response.status === HTTP_STATUS.OK) {
        setResultado(response.data.results);
        setTotal(response.data.count);
      }
    } catch (e) {
      toastError("Houve um erro ao tentar trocar página");
    }
    setCarregando(false);
  };

  return (
    <div className="card mt-3 card-cadastro-geral ps-3 pe-3">
      <Spin tip="Carregando..." spinning={carregando}>
        <Filtros
          setResultado={setResultado}
          nomes={nomes}
          status={status}
          setCarregando={setCarregando}
          setTotal={setTotal}
          setFiltros={setFiltros}
          setPage={setPage}
          changePage={() => changePage(page)}
        />
        {resultado && (
          <>
            <Tabela resultado={resultado} changePage={() => changePage(page)} />
            <Paginacao
              className="mt-3 mb-3"
              current={page || 1}
              total={total}
              showSizeChanger={false}
              onChange={(page) => {
                setPage(page);
                changePage(page);
              }}
              pageSize={10}
            />
          </>
        )}
      </Spin>
    </div>
  );
};
