import React, { useEffect, useState } from "react";
import { Pagination, Spin } from "antd";
import Filtros from "./components/Filtros";
import ListagemGuias from "./components/ListagemGuias";
import { gerarParametrosConsulta } from "helpers/utilities";
import { getNotificacoesOcorrencia } from "services/logistica.service";

export default () => {
  const [carregando, setCarregando] = useState(false);
  const [notificacoes, setNotificacoes] = useState();
  const [filtros, setFiltros] = useState();
  const [page, setPage] = useState();
  const [total, setTotal] = useState();

  useEffect(() => {
    if (filtros) {
      buscarGuias(1);
      setPage(1);
    }
  }, [filtros]);

  const buscarGuias = async page => {
    setCarregando(true);

    const params = gerarParametrosConsulta({ page: page, ...filtros });
    const response = await getNotificacoesOcorrencia(params);
    if (response.data.count) {
      setNotificacoes(response.data.results);
      setTotal(response.data.count);
    } else {
      setTotal(response.data.count);
      setNotificacoes([]);
    }

    setCarregando(false);
  };

  const nextPage = page => {
    buscarGuias(page);
    setPage(page);
  };

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-guias-notificacoes">
        <div className="card-body guias-notificacoes">
          <Filtros setFiltros={setFiltros} setNotificacoes={setNotificacoes} />

          {notificacoes && (
            <>
              <hr />
              <ListagemGuias guias={notificacoes} />
              <div className="row">
                <div className="col">
                  <Pagination
                    current={page}
                    total={total}
                    showSizeChanger={false}
                    onChange={nextPage}
                    pageSize={10}
                    className="float-left mb-2"
                  />
                </div>
              </div>
              {total === 0 && (
                <div className="text-center mt-5">
                  Nenhum resultado encontrado
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Spin>
  );
};
