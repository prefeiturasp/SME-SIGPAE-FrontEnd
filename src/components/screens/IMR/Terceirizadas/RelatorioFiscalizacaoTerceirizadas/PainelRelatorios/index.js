import {
  jsx as _jsx,
  Fragment as _Fragment,
  jsxs as _jsxs,
} from "react/jsx-runtime";
import { useEffect, useState } from "react";
import HTTP_STATUS from "http-status-codes";
import { Spin } from "antd";
import { gerarParametrosConsulta } from "src/helpers/utilities";
import { getListRelatoriosVisitaSupervisao } from "src/services/imr/painelGerencial";
import { Paginacao } from "src/components/Shareable/Paginacao";
import { Filtros } from "./components/Filtros";
import { Listagem } from "./components/Listagem";
import { getDashboardPainelGerencialSupervisao } from "src/services/imr/painelGerencial";
import { CardPorStatus } from "./components/CardPorStatus";
import "./style.scss";
export const PainelRelatorios = () => {
  const [filtros, setFiltros] = useState({});
  const [page, setPage] = useState(1);
  const [totalResultados, setTotalResultados] = useState(0);
  const [consultaRealizada, setConsultaRealizada] = useState(false);
  const [relatoriosVisita, setRelatoriosVisita] = useState([]);
  const [dashboard, setDashboard] = useState();
  const [statusSelecionado, setStatusSelecionado] = useState("");
  const [carregandoTabela, setCarregandoTabela] = useState(false);
  const [form, setForm] = useState();
  const perfilNutriSupervisao =
    JSON.parse(localStorage.getItem("perfil")) ===
    "COORDENADOR_SUPERVISAO_NUTRICAO";
  const buscarResultados = async (filtros_, pageNumber) => {
    setCarregandoTabela(true);
    try {
      const params = gerarParametrosConsulta({
        page: pageNumber,
        ...filtros_,
      });
      const response = await getListRelatoriosVisitaSupervisao(params);
      if (response.status === HTTP_STATUS.OK) {
        setRelatoriosVisita(response.data.results);
        setTotalResultados(response.data.count);
        setConsultaRealizada(true);
      }
    } finally {
      setCarregandoTabela(false);
    }
  };
  const getDashboardPainelGerencialSupervisaoAsync = async () => {
    const response = await getDashboardPainelGerencialSupervisao(filtros);
    if (response.status === HTTP_STATUS.OK) {
      setDashboard(
        response.data.results.map((item) => {
          if (
            item.status === "NUTRIMANIFESTACAO_A_VALIDAR" &&
            !perfilNutriSupervisao
          ) {
            return { ...item, label: "Enviados pela Supervisão" };
          }
          return item;
        })
      );
    }
  };
  const proximaPagina = (page) => {
    buscarResultados(filtros, page);
    setPage(page);
  };
  useEffect(() => {
    getDashboardPainelGerencialSupervisaoAsync();
  }, []);
  return _jsx(Spin, {
    tip: "Carregando...",
    spinning: !dashboard,
    children: _jsx("div", {
      className: "card painel-acompanhamento-supervisao mt-3",
      children: _jsx("div", {
        className: "card-body",
        children:
          dashboard &&
          _jsxs(_Fragment, {
            children: [
              _jsx("div", {
                className: "d-flex row row-cols-1",
                children: dashboard.map((cardStatus, index) => {
                  return _jsx(
                    CardPorStatus,
                    {
                      cardStatus: cardStatus,
                      form: form,
                      setConsultaRealizada: setConsultaRealizada,
                      setFiltros: setFiltros,
                      setPage: setPage,
                      setRelatoriosVisita: setRelatoriosVisita,
                      setStatusSelecionado: setStatusSelecionado,
                      statusSelecionado: statusSelecionado,
                    },
                    index
                  );
                }),
              }),
              _jsx("div", {
                className: "mt-3 text-center",
                children:
                  "Selecione um dos status acima para visualizar a listagem de relat\u00F3rios",
              }),
              statusSelecionado &&
                _jsx(Filtros, {
                  filtros: filtros,
                  setFiltros: setFiltros,
                  setRelatoriosVisita: setRelatoriosVisita,
                  setConsultaRealizada: setConsultaRealizada,
                  perfilNutriSupervisao: perfilNutriSupervisao,
                  buscarResultados: buscarResultados,
                  form_: form,
                  setForm: setForm,
                }),
              _jsx(Spin, {
                tip: "Carregando...",
                spinning: carregandoTabela,
                children:
                  consultaRealizada &&
                  (relatoriosVisita.length === 0
                    ? _jsx("div", {
                        className: "text-center mt-4 mb-4",
                        children: "Nenhum resultado encontrado",
                      })
                    : _jsxs(_Fragment, {
                        children: [
                          _jsx(Listagem, {
                            objetos: relatoriosVisita,
                            perfilNutriSupervisao: perfilNutriSupervisao,
                            getDashboardPainelGerencialSupervisaoAsync:
                              getDashboardPainelGerencialSupervisaoAsync,
                            buscarResultados: buscarResultados,
                            filtros: filtros,
                            pagina: page,
                          }),
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
              }),
            ],
          }),
      }),
    }),
  });
};
