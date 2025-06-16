import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import Filtros from "./components/Filtros";
import ListagemNotificacoes from "./components/ListagemNotificacoes";
import { gerarParametrosConsulta } from "src/helpers/utilities";
import { getNotificacoesOcorrencia } from "src/services/logistica.service";
import { Paginacao } from "src/components/Shareable/Paginacao";
import { PERFIL } from "../../../../constants/shared";
import useSomenteLeitura from "../../../../hooks/useSomenteLeitura";

export default ({ fiscal = false }) => {
  const [carregando, setCarregando] = useState(false);
  const [notificacoes, setNotificacoes] = useState();
  const [filtros, setFiltros] = useState();
  const [page, setPage] = useState();
  const [total, setTotal] = useState();

  const somenteLeitura = useSomenteLeitura([
    PERFIL.ADMINISTRADOR_CODAE_GABINETE,
    PERFIL.DILOG_DIRETORIA,
  ]);

  useEffect(() => {
    if (filtros) {
      buscarGuias(1);
      setPage(1);
    }
  }, [filtros]);

  const buscarGuias = async (page) => {
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

  const nextPage = (page) => {
    buscarGuias(page);
    setPage(page);
  };

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-guias-notificacoes">
        <div className="card-body guias-notificacoes">
          <Filtros
            setFiltros={setFiltros}
            setNotificacoes={setNotificacoes}
            fiscal={fiscal}
            somenteLeitura={somenteLeitura}
          />

          {notificacoes && (
            <>
              <hr />
              <ListagemNotificacoes
                notificacoes={notificacoes}
                fiscal={fiscal}
                somenteLeitura={somenteLeitura}
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
