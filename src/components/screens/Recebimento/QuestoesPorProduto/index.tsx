import React, { useCallback, useEffect, useState } from "react";
import { Spin } from "antd";

import { FichaTecnicaSimples } from "src/interfaces/pre_recebimento.interface";
import {
  FiltrosQuestoesPorProduto,
  QuestaoConferencia,
  QuestoesPorProduto,
} from "src/interfaces/recebimento.interface";
import { getListaFichasTecnicasSimples } from "src/services/fichaTecnica.service";
import {
  listarQuestoesConferenciaSimples,
  listarQuestoesPorProduto,
} from "src/services/recebimento/questoesConferencia.service";
import { gerarParametrosConsulta } from "src/helpers/utilities";
import { Paginacao } from "src/components/Shareable/Paginacao";

import Filtros from "./components/Filtros";
import Listagem from "./components/Listagem";

export default () => {
  const [carregando, setCarregando] = useState(false);

  const [fichasTecnicas, setFichasTecnicas] = useState<FichaTecnicaSimples[]>(
    []
  );
  const [questoesConferencia, setQuestoesConferencia] = useState<
    QuestaoConferencia[]
  >([]);
  const [questoesPorProdutos, setQuestoesPorProdutos] = useState<
    QuestoesPorProduto[]
  >([]);

  const [filtros, setFiltros] = useState<FiltrosQuestoesPorProduto>(
    {} as FiltrosQuestoesPorProduto
  );
  const [consultaRealizada, setConsultaRealizada] = useState(false);
  const [page, setPage] = useState(1);
  const [totalResultados, setTotalResultados] = useState(0);

  const carregarDados = useCallback(async () => {
    setCarregando(true);

    try {
      const [responseFichas, responseQuestoes] = await Promise.all([
        getListaFichasTecnicasSimples(),
        listarQuestoesConferenciaSimples(),
        buscarResultados(1),
      ]);

      setFichasTecnicas(responseFichas.data.results);
      setQuestoesConferencia(responseQuestoes.data.results);
      setPage(1);
    } finally {
      setCarregando(false);
    }
  }, []);

  const buscarResultados = async (pageNumber: number) => {
    try {
      setCarregando(true);

      const params: URLSearchParams = gerarParametrosConsulta({
        page: pageNumber,
        ...filtros,
      });
      const response = await listarQuestoesPorProduto(params);

      if (response?.status === 200) {
        setQuestoesPorProdutos(response.data.results);
        setTotalResultados(response.data.count);
        setConsultaRealizada(true);
      }
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    buscarResultados(1);
    setPage(1);
  }, [filtros]);

  const carregarProximaPagina = (page: number) => {
    buscarResultados(page);
    setPage(page);
  };

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-ficha-tecnica">
        <div className="card-body ficha-tecnica">
          <Filtros
            fichasTecnicas={fichasTecnicas}
            questoesConferencia={questoesConferencia}
            setFiltros={setFiltros}
            setQuestoesPorProduto={setQuestoesPorProdutos}
            setConsultaRealizada={setConsultaRealizada}
          />

          {questoesPorProdutos.length ? (
            <>
              <Listagem questoesPorProdutos={questoesPorProdutos} />

              <Paginacao
                current={page}
                total={totalResultados}
                onChange={carregarProximaPagina}
              />
            </>
          ) : (
            consultaRealizada && (
              <div className="text-center mt-3 mb-4">
                Nenhum resultado encontrado
              </div>
            )
          )}
        </div>
      </div>
    </Spin>
  );
};
