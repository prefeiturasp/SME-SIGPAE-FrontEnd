import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import { gerarParametrosConsulta } from "src/helpers/utilities";
import { getListagemSolicitacaoAlteracaoCronograma } from "../../../../services/cronograma.service";
import Filtros from "./components/Filtros/index.jsx";
import ListagemAlteracoesCronogramas from "./components/ListagemAlteracoesCronogramas/index.jsx";
import { remove_filtros_nulos } from "./helper";
import { Paginacao } from "src/components/Shareable/Paginacao/index.jsx";

export default ({ fornecedor }) => {
  const [carregando, setCarregando] = useState(false);
  const [alteracoesCronogramas, setAlteracoesCronogramas] = useState();
  const [filtros, setFiltros] = useState();
  const [total, setTotal] = useState();
  const [page, setPage] = useState();
  const [buscaPorParametro, setBuscaPorParametro] = useState(false);

  const buscarSolicitacoesCronograma = async (page) => {
    setCarregando(true);
    setFiltros(remove_filtros_nulos(filtros));
    if (filtros?.status) filtros.status = filtros.status.flat();
    const params = gerarParametrosConsulta({ page: page, ...filtros });
    const response = await getListagemSolicitacaoAlteracaoCronograma(params);
    if (response.data.count) {
      setAlteracoesCronogramas(response.data.results);
      setTotal(response.data.count);
    } else {
      setTotal(response.data.count);
      setAlteracoesCronogramas();
    }
    setCarregando(false);
    if (response.data.count === 1 && buscaPorParametro) {
      setBuscaPorParametro(false);
    }
  };

  useEffect(() => {
    if (filtros) {
      buscarSolicitacoesCronograma(1);
      setPage(1);
    }
  }, [filtros]);

  const nextPage = (page) => {
    buscarSolicitacoesCronograma(page);
    setPage(page);
  };

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-cronograma-entrega">
        <div className="card-body cronograma-entrega">
          <Filtros
            setFiltros={setFiltros}
            setAlteracoesCronogramas={setAlteracoesCronogramas}
            setTotal={setTotal}
            alteracoesCronogramas={alteracoesCronogramas}
            page={page}
            fornecedor={fornecedor}
          />
          {alteracoesCronogramas && (
            <>
              <ListagemAlteracoesCronogramas
                alteracoesCronogramas={alteracoesCronogramas}
                fornecedor={fornecedor}
              />
              <div className="row">
                <div className="col">
                  <Paginacao
                    className="mt-3 mb-3"
                    current={page}
                    total={total}
                    showSizeChanger={false}
                    onChange={nextPage}
                    pageSize={10}
                  />
                </div>
              </div>
            </>
          )}
          {total === 0 && (
            <div className="text-center mt-5 pt-5">
              Não existe informação para os critérios de busca utilizados.
            </div>
          )}
        </div>
      </div>
    </Spin>
  );
};
