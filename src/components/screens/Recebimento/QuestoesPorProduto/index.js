import {
  jsx as _jsx,
  Fragment as _Fragment,
  jsxs as _jsxs,
} from "react/jsx-runtime";
import { useCallback, useEffect, useState } from "react";
import { Spin } from "antd";
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
  const [fichasTecnicas, setFichasTecnicas] = useState([]);
  const [questoesConferencia, setQuestoesConferencia] = useState([]);
  const [questoesPorProdutos, setQuestoesPorProdutos] = useState([]);
  const [filtros, setFiltros] = useState({});
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
  const buscarResultados = async (pageNumber) => {
    try {
      setCarregando(true);
      const params = gerarParametrosConsulta({
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
  const carregarProximaPagina = (page) => {
    buscarResultados(page);
    setPage(page);
  };
  return _jsx(Spin, {
    tip: "Carregando...",
    spinning: carregando,
    children: _jsx("div", {
      className: "card mt-3 card-ficha-tecnica",
      children: _jsxs("div", {
        className: "card-body ficha-tecnica",
        children: [
          _jsx(Filtros, {
            fichasTecnicas: fichasTecnicas,
            questoesConferencia: questoesConferencia,
            setFiltros: setFiltros,
            setQuestoesPorProduto: setQuestoesPorProdutos,
            setConsultaRealizada: setConsultaRealizada,
          }),
          questoesPorProdutos.length
            ? _jsxs(_Fragment, {
                children: [
                  _jsx(Listagem, { questoesPorProdutos: questoesPorProdutos }),
                  _jsx(Paginacao, {
                    current: page,
                    total: totalResultados,
                    onChange: carregarProximaPagina,
                  }),
                ],
              })
            : consultaRealizada &&
              _jsx("div", {
                className: "text-center mt-3 mb-4",
                children: "Nenhum resultado encontrado",
              }),
        ],
      }),
    }),
  });
};
