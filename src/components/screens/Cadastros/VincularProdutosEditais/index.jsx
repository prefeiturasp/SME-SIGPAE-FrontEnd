import React, { useEffect, useState } from "react";
import { Spin, Pagination } from "antd";
import Filtros from "./componentes/Filtros";
import Tabela from "./componentes/Tabela";
import HTTP_STATUS from "http-status-codes";
import {
  filtrosVincularProdutoEdital,
  filtrarPorEditalNomeTipo
} from "services/produto.service";
import { toastError } from "components/Shareable/Toast/dialogs";

export default () => {
  const [carregando, setCarregando] = useState(true);
  const [resultado, setResultado] = useState(undefined);
  const [listaProdutos, setListaProdutos] = useState(true);
  const [listaEditais, setListaEditais] = useState(undefined);
  const [listaTipos, setListaTipos] = useState(undefined);
  const [total, setTotal] = useState(0);
  const [filtros, setFiltros] = useState({});
  const [page, setPage] = useState(1);

  async function fetchData() {
    try {
      const responseFiltros = await filtrosVincularProdutoEdital();
      if (responseFiltros.status === HTTP_STATUS.OK) {
        setListaProdutos(responseFiltros.data.produtos);
        setListaEditais(responseFiltros.data.editais);
        setListaTipos([
          { nome: "Comum", key: "Comum" },
          { nome: "Dieta Especial", key: "Dieta especial" }
        ]);
      }
    } catch (e) {
      toastError("Houve um erro ao carregar opções dos filtros");
    }
    setResultado(undefined);
    setTotal(0);
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
      payload["page_size"] = 10;
      const response = await filtrarPorEditalNomeTipo(payload);
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
          listaProdutos={listaProdutos}
          listaEditais={listaEditais}
          listaTipos={listaTipos}
          setCarregando={setCarregando}
          setTotal={setTotal}
          setFiltros={setFiltros}
          setPage={setPage}
          filtrarPorEditalNomeTipo={filtrarPorEditalNomeTipo}
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
