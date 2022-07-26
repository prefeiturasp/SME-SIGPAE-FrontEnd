import React, { useEffect, useState } from "react";
import { Spin, Pagination } from "antd";
import HTTP_STATUS from "http-status-codes";
import { toastError } from "components/Shareable/Toast/dialogs";
import {
  getNomesProtudosEdital,
  getCadastroProdutosEdital
} from "services/produto.service";
import Filtros from "./componentes/Filtros";
import Tabela from "./componentes/Tabela";
import "./style.scss";

export default () => {
  const [carregando, setCarregando] = useState(true);
  const [resultado, setResultado] = useState(undefined);
  const [nomes, setNomes] = useState(undefined);
  const [status, setStatus] = useState(undefined);
  const [total, setTotal] = useState(0);
  const [filtros, setFiltros] = useState({});
  const [page, setPage] = useState(1);

  async function fetchData() {
    const respNomes = await getNomesProtudosEdital();
    const respItems = await getCadastroProdutosEdital({});
    const nomeStatus = [
      {
        status: "Ativo",
        uuid: true
      },
      {
        status: "Inativo",
        uuid: false
      }
    ];
    setNomes(respNomes.data.results);

    setStatus(nomeStatus);
    setResultado(respItems.data.results);
    setTotal(respItems.data.count);
    setCarregando(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const changePage = async page => {
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
    <div className="card mt-3 card-cadastro-geral pl-3 pr-3">
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
            <Pagination
              className="mt-3 mb-3"
              current={page || 1}
              total={total}
              showSizeChanger={false}
              onChange={page => {
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
