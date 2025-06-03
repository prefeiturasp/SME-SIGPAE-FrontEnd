import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Spin } from "antd";
import Filtros from "./components/Filtros";
import { gerarParametrosConsulta } from "src/helpers/utilities";
import {
  getListagemRelatorioCronogramas,
  baixarRelatorioCronogramasExcel,
  baixarRelatorioCronogramasPdf,
} from "../../../../../services/cronograma.service";
import { Paginacao } from "src/components/Shareable/Paginacao";
import Listagem from "./components/Listagem";
import "./styles.scss";
import moment from "moment";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import ModalSolicitacaoDownload from "src/components/Shareable/ModalSolicitacaoDownload";
export default () => {
  const [carregando, setCarregando] = useState(false);
  const [filtros, setFiltros] = useState();
  const [page, setPage] = useState(1);
  const [totalResultados, setTotalResultados] = useState(0);
  const [consultaRealizada, setConsultaRealizada] = useState(false);
  const [ativos, setAtivos] = useState([]);
  const [cronogramas, setCronogramas] = useState([]);
  const [totalizadores, setTotalizadores] = useState();
  const [enviandoArquivo, setEnviandoArquivo] = useState(false);
  const [exibirModalCentralDownloads, setExibirModalCentralDownloads] =
    useState(false);
  const buscarResultados = async (page) => {
    setCarregando(true);
    const params = gerarParametrosConsulta({ page: page, ...filtros });
    const response = await getListagemRelatorioCronogramas(params);
    setAtivos([]);
    setCronogramas(response.data.results);
    setTotalizadores({
      "Total de Cronogramas Criados": response.data.count,
      ...response.data.totalizadores,
    });
    setTotalResultados(response.data.count);
    setConsultaRealizada(true);
    setCarregando(false);
  };
  const nextPage = (page) => {
    buscarResultados(page);
    setPage(page);
  };
  useEffect(() => {
    if (filtros) {
      buscarResultados(1);
      setPage(1);
    }
  }, [filtros]);
  const baixarRelatorio = async (formato) => {
    setEnviandoArquivo(true);
    try {
      const params = gerarParametrosConsulta(filtros);
      const response =
        formato === "xlsx"
          ? await baixarRelatorioCronogramasExcel(params)
          : await baixarRelatorioCronogramasPdf(params);
      response?.status === 200 && setExibirModalCentralDownloads(true);
    } catch {
      toastError(`Erro ao exportar ${formato}. Tente novamente mais tarde.`);
    } finally {
      setEnviandoArquivo(false);
    }
  };
  return _jsx(Spin, {
    tip: "Carregando...",
    spinning: carregando,
    children: _jsx("div", {
      className: "card mt-3 card-relatorio-cronograma",
      children: _jsxs("div", {
        className: "card-body relatorio-cronograma",
        children: [
          _jsx(Filtros, {
            setFiltros: setFiltros,
            setCarregando: setCarregando,
            setCronogramas: setCronogramas,
            setConsultaRealizada: setConsultaRealizada,
          }),
          consultaRealizada &&
            _jsxs(_Fragment, {
              children: [
                totalizadores &&
                  _jsxs("div", {
                    className: "row mt-4",
                    children: [
                      _jsxs("div", {
                        className: "col-12 titulo-cards",
                        children: [
                          "TOTAL DE CRONOGRAMAS DE ENTREGAS - AT\u00C9",
                          " ",
                          moment(new Date()).format("DD/MM/YYYY"),
                        ],
                      }),
                      Object.keys(totalizadores).map((totalizador, key) => {
                        return _jsx(
                          "div",
                          {
                            className: "col-4 mt-3",
                            children: _jsx("div", {
                              className: "totalizador ps-3 pe-3",
                              children: _jsxs("div", {
                                className: "d-flex justify-content-between",
                                children: [
                                  _jsx("div", {
                                    className: "titulo",
                                    children: totalizador,
                                  }),
                                  _jsx("div", {
                                    className: "valor",
                                    children: totalizadores[totalizador],
                                  }),
                                ],
                              }),
                            }),
                          },
                          key
                        );
                      }),
                    ],
                  }),
                cronogramas.length === 0
                  ? _jsx("div", {
                      className: "text-center mt-4 mb-4",
                      children: "Nenhum resultado encontrado",
                    })
                  : _jsxs(_Fragment, {
                      children: [
                        _jsx(Listagem, {
                          objetos: cronogramas,
                          ativos: ativos,
                          setAtivos: setAtivos,
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
                        _jsx("div", {
                          className: "row mt-4 mb-2",
                          children: _jsxs("div", {
                            className: "col p-0",
                            children: [
                              _jsx(Botao, {
                                texto: "Baixar em PDF",
                                style: BUTTON_STYLE.GREEN_OUTLINE,
                                icon: BUTTON_ICON.FILE_PDF,
                                type: BUTTON_TYPE.BUTTON,
                                disabled: enviandoArquivo,
                                onClick: () => baixarRelatorio("pdf"),
                                className: "float-end",
                              }),
                              _jsx(Botao, {
                                texto: "Baixar em Excel",
                                style: BUTTON_STYLE.GREEN_OUTLINE,
                                icon: BUTTON_ICON.FILE_EXCEL,
                                type: BUTTON_TYPE.BUTTON,
                                disabled: enviandoArquivo,
                                onClick: () => baixarRelatorio("xlsx"),
                                className: "float-end me-3",
                              }),
                              exibirModalCentralDownloads &&
                                _jsx(ModalSolicitacaoDownload, {
                                  show: exibirModalCentralDownloads,
                                  setShow: setExibirModalCentralDownloads,
                                }),
                            ],
                          }),
                        }),
                      ],
                    }),
              ],
            }),
        ],
      }),
    }),
  });
};
