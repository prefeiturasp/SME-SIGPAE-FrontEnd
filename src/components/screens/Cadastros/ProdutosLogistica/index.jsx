import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import {
  getListaProdutosLogistica,
  getNomesProdutosLogistica,
} from "src/services/produto.service";
import Filtros from "./componentes/Filtros";
import Tabela from "./componentes/Tabela";
import "./style.scss";
import { gerarParametrosConsulta } from "src/helpers/utilities";
import { Paginacao } from "src/components/Shareable/Paginacao";

export default () => {
  const [carregando, setCarregando] = useState(false);
  const [resultado, setResultado] = useState(undefined);
  const [nomes, setNomes] = useState(undefined);
  const [total, setTotal] = useState(0);

  const [filtros, setFiltros] = useState();
  const [page, setPage] = useState(1);

  const buscarProdutos = async (page) => {
    setCarregando(true);
    const params = gerarParametrosConsulta({ page: page, ...filtros });
    const res = await getListaProdutosLogistica(params);
    setResultado(res.data.results);
    setTotal(res.data.count);
    setCarregando(false);
  };

  const buscarNomes = async () => {
    const res = await getNomesProdutosLogistica();
    setNomes(res.data.results);
  };

  useEffect(() => {
    if (filtros) {
      buscarProdutos(1);
      setPage(1);
    }
  }, [filtros]);

  useEffect(() => {
    buscarNomes();
  }, []);

  const changePage = (page) => {
    buscarProdutos(page);
    setPage(page);
  };

  return (
    <div className="card mt-3 card-produtos-logistica">
      <div className="card-body produtos-logistica">
        <Spin tip="Carregando..." spinning={carregando}>
          <Filtros
            setResultado={setResultado}
            nomes={nomes}
            setFiltros={setFiltros}
          />
          {resultado && (
            <>
              <hr />
              <Tabela produtos={resultado} />
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
              {total === 0 && (
                <div className="text-center mt-5">
                  Nenhum resultado encontrado
                </div>
              )}
            </>
          )}
        </Spin>
      </div>
    </div>
  );
};
