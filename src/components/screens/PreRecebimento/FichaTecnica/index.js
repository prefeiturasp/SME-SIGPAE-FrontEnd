import {
  jsx as _jsx,
  Fragment as _Fragment,
  jsxs as _jsxs,
} from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Spin } from "antd";
import { Paginacao } from "../../../Shareable/Paginacao";
import Filtros from "./components/Filtros";
import Listagem from "./components/Listagem";
import { gerarParametrosConsulta } from "../../../../helpers/utilities";
import { listarFichastecnicas } from "src/services/fichaTecnica.service";
import "./styles.scss";
export default () => {
  const [carregando, setCarregando] = useState(false);
  const [filtros, setFiltros] = useState({});
  const [page, setPage] = useState(1);
  const [totalResultados, setTotalResultados] = useState(0);
  const [consultaRealizada, setConsultaRealizada] = useState(false);
  const [fichas, setFichas] = useState([]);
  const buscarResultados = async (pageNumber) => {
    setCarregando(true);
    const params = gerarParametrosConsulta({
      page: pageNumber,
      ...filtros,
    });
    const response = await listarFichastecnicas(params);
    setFichas(response.data.results);
    setTotalResultados(response.data.count);
    setConsultaRealizada(true);
    setCarregando(false);
  };
  const nextPage = (page) => {
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
      className: "card mt-3 card-ficha-tecnica",
      children: _jsxs("div", {
        className: "card-body ficha-tecnica",
        children: [
          _jsx(Filtros, {
            setFiltros: setFiltros,
            setFichas: setFichas,
            setConsultaRealizada: setConsultaRealizada,
          }),
          consultaRealizada &&
            (fichas.length === 0
              ? _jsx("div", {
                  className: "text-center mt-4 mb-4",
                  children: "Nenhum resultado encontrado",
                })
              : _jsxs(_Fragment, {
                  children: [
                    _jsx(Listagem, {
                      objetos: fichas,
                      setCarregando: setCarregando,
                    }),
                    _jsx("div", {
                      className: "row",
                      children: _jsx("div", {
                        className: "col",
                        children: _jsx(Paginacao, {
                          current: page,
                          total: totalResultados,
                          onChange: nextPage,
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
