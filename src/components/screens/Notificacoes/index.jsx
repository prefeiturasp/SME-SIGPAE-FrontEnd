import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import "./style.scss";
import {
  getNotificacoesGerais,
  getPendenciasNaoResolvidas,
  setNotificacaoMarcarDesmarcarLida,
} from "src/services/notificacoes.service";
import CardNotificacao from "./components/CardNotificacao";
import Filtros from "./components/Filtros";
import { gerarParametrosConsulta } from "src/helpers/utilities";
import { Paginacao } from "src/components/Shareable/Paginacao";

export default () => {
  const [carregando] = useState(false);
  const [notificacoes, setNotificacoes] = useState([]);
  const [pendencias, setPendencias] = useState([]);
  const [totalNotifs, setTotalNotifs] = useState(0);
  const [totalPendencias, setTotalPendencias] = useState(0);
  const [page, setPage] = useState(1);
  const [clickBtnNotificacoes, setClickBtnNotificacoes] = useState(false);
  const [filtros, setFiltros] = useState();

  const buscarNotificacoes = async (page) => {
    let pendenciasResponse;
    if (!filtros.lido) {
      let filtrosPendencias = { ...filtros };
      delete filtrosPendencias.lido;
      const paramsPendencias = gerarParametrosConsulta({
        ...filtrosPendencias,
      });
      pendenciasResponse = await getPendenciasNaoResolvidas(paramsPendencias);
    }

    const paramsNotifs = gerarParametrosConsulta({ page: page, ...filtros });
    let notifsResponse = await getNotificacoesGerais(paramsNotifs);
    let pendenciasNew = pendenciasResponse
      ? pendenciasResponse.data.results
      : [];
    setPendencias(pendenciasNew);
    setNotificacoes(notifsResponse.data.results);
    setTotalNotifs(notifsResponse.data.count);
    setTotalPendencias(pendenciasNew.length);
  };

  const nextPage = (page) => {
    buscarNotificacoes(page);
    setPage(page);
  };

  const toggleBtnNotificacoes = (uuid) => {
    setClickBtnNotificacoes({
      [uuid]: !clickBtnNotificacoes[uuid],
    });
  };

  const handleChangeMarcarComoLida = async (notificacao, index) => {
    const payload = {
      uuid: notificacao.uuid,
      lido: !notificacao.lido,
    };
    if (notificacao.tipo === "Pendência" && notificacao.resolvido === false) {
      let pendenciasNew = pendencias;
      pendenciasNew[index].lido = !pendenciasNew[index].lido;
      setPendencias([...pendenciasNew]);
    } else {
      let notificacoesNew = notificacoes;
      notificacoesNew[index].lido = !notificacoesNew[index].lido;
      setNotificacoes([...notificacoesNew]);
    }

    await setNotificacaoMarcarDesmarcarLida(payload);
  };

  useEffect(() => {
    const queryString = window.location.search;

    if (queryString) {
      const urlParams = new URLSearchParams(window.location.search);
      const codigo = urlParams.get("uuid");
      const filtro = {
        uuid: codigo,
      };
      setFiltros({ ...filtro });
    } else {
      setFiltros({});
    }
  }, []);

  useEffect(() => {
    if (filtros) {
      buscarNotificacoes(1);
      setPage(1);
    }
  }, [filtros]);

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-notificacoes">
        <div className="card-body notificacoes">
          <Filtros filtros={filtros} setFiltros={setFiltros} />
          {notificacoes && (
            <>
              <div className="accordion mt-1" id="accordionNotificacoes">
                {pendencias && pendencias.length > 0 && (
                  <>
                    <div className="titulo">Pendências</div>
                    {pendencias.map((pendencia, index) => (
                      <CardNotificacao
                        key={pendencia.uuid}
                        notificacao={pendencia}
                        handleChangeMarcarComoLida={handleChangeMarcarComoLida}
                        clickBtnNotificacoes={clickBtnNotificacoes}
                        toggleBtnNotificacoes={toggleBtnNotificacoes}
                        index={index}
                      />
                    ))}
                  </>
                )}
                <hr />
                {notificacoes && notificacoes.length > 0 && (
                  <>
                    <div className="titulo">Outras Notificações</div>
                    {notificacoes.map((notificacao, index) => (
                      <CardNotificacao
                        key={notificacao.uuid}
                        notificacao={notificacao}
                        handleChangeMarcarComoLida={handleChangeMarcarComoLida}
                        clickBtnNotificacoes={clickBtnNotificacoes}
                        toggleBtnNotificacoes={toggleBtnNotificacoes}
                        index={index}
                      />
                    ))}
                  </>
                )}
              </div>
              <div className="row">
                <div className="col">
                  <Paginacao
                    className="mt-3 mb-3"
                    current={page}
                    total={totalNotifs}
                    showSizeChanger={false}
                    onChange={nextPage}
                    pageSize={5}
                  />
                </div>
              </div>
            </>
          )}
          {totalNotifs === 0 && totalPendencias === 0 && (
            <div className="text-center mt-5">
              Não existe informação para os critérios de busca utilizados.
            </div>
          )}
        </div>
      </div>
    </Spin>
  );
};
