import {
  jsx as _jsx,
  Fragment as _Fragment,
  jsxs as _jsxs,
} from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Spin } from "antd";
import "./styles.scss";
import { gerarParametrosConsulta } from "../../../../helpers/utilities";
import { listarDocumentosRecebimento } from "../../../../services/documentosRecebimento.service";
import Filtros from "./components/Filtros";
import Listagem from "./components/Listagem";
import { Paginacao } from "../../../Shareable/Paginacao";
export default () => {
  const [carregando, setCarregando] = useState(false);
  const [filtros, setFiltros] = useState({});
  const [page, setPage] = useState(1);
  const [totalResultados, setTotalResultados] = useState(0);
  const [consultaRealizada, setConsultaRealizada] = useState(false);
  const [documentos, setDocumentos] = useState([]);
  const buscarResultados = async (pageNumber) => {
    try {
      setCarregando(true);
      const params = gerarParametrosConsulta({
        page: pageNumber,
        ...filtros,
      });
      const response = await listarDocumentosRecebimento(params);
      if (response?.status === 200) {
        setDocumentos(response.data.results);
        setTotalResultados(response.data.count);
        setConsultaRealizada(true);
      }
    } finally {
      setCarregando(false);
    }
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
      className: "card mt-3 card-documentos-recebimento",
      children: _jsxs("div", {
        className: "card-body documentos-recebimento",
        children: [
          _jsx(Filtros, {
            setFiltros: setFiltros,
            setDocumentos: setDocumentos,
            setConsultaRealizada: setConsultaRealizada,
          }),
          consultaRealizada &&
            (documentos.length === 0
              ? _jsx("div", {
                  className: "text-center mt-4 mb-4",
                  children: "Nenhum resultado encontrado",
                })
              : _jsxs(_Fragment, {
                  children: [
                    _jsx(Listagem, {
                      objetos: documentos,
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
