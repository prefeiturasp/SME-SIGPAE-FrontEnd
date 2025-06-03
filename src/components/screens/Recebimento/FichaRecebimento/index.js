import {
  jsx as _jsx,
  Fragment as _Fragment,
  jsxs as _jsxs,
} from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Spin } from "antd";
import { gerarParametrosConsulta } from "src/helpers/utilities";
import { listarFichasRecebimentos } from "src/services/fichaRecebimento.service";
import { Paginacao } from "src/components/Shareable/Paginacao";
import Filtros from "./components/Filtros";
import Listagem from "./components/Listagem";
export default () => {
  const [carregando, setCarregando] = useState(false);
  const [filtros, setFiltros] = useState({});
  const [page, setPage] = useState(1);
  const [totalResultados, setTotalResultados] = useState(0);
  const [consultaRealizada, setConsultaRealizada] = useState(false);
  const [fichasRecebimento, setFichasRecebimento] = useState([]);
  const buscarResultados = async (pageNumber) => {
    setCarregando(true);
    try {
      const params = gerarParametrosConsulta({
        page: pageNumber,
        ...filtros,
      });
      const response = await listarFichasRecebimentos(params);
      if (response?.status === 200) {
        setFichasRecebimento(response.data.results);
        setTotalResultados(response.data.count);
        setConsultaRealizada(true);
      }
    } finally {
      setCarregando(false);
    }
  };
  const proximaPagina = (page) => {
    buscarResultados(page);
    setPage(page);
  };
  useEffect(() => {
    buscarResultados(1);
    setPage(1);
  }, [filtros]);
  return _jsx(Spin, {
    tip: "Carregando...",
    spinning: carregando,
    children: _jsx("div", {
      className: "card mt-3 card-documentos-recebimento",
      children: _jsxs("div", {
        className: "card-body documentos-recebimento",
        children: [
          _jsx(Filtros, {
            setFiltros: setFiltros,
            setFichasRecebimento: setFichasRecebimento,
            setConsultaRealizada: setConsultaRealizada,
          }),
          consultaRealizada &&
            (fichasRecebimento.length === 0
              ? _jsx("div", {
                  className: "text-center mt-4 mb-4",
                  children: "Nenhum resultado encontrado",
                })
              : _jsxs(_Fragment, {
                  children: [
                    _jsx(Listagem, { objetos: fichasRecebimento }),
                    _jsx("div", {
                      className: "row",
                      children: _jsx("div", {
                        className: "col",
                        children: _jsx(Paginacao, {
                          current: page,
                          total: totalResultados,
                          onChange: proximaPagina,
                        }),
                      }),
                    }),
                  ],
                })),
        ],
      }),
    }),
  });
};
