import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Spin } from "antd";
import { Filtros } from "./components/Filtros/Index";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import ModalSolicitacaoDownload from "src/components/Shareable/ModalSolicitacaoDownload";
import {
  getFiltros,
  getMesesAnos,
  getTotalAlunosMatriculados,
  imprimirRelatorioControleFrequencia,
} from "src/services/medicaoInicial/controleDeFrequencia.service";
import { formataData, dataAtualDDMMYYYY } from "src/helpers/utilities";
import { MESES } from "src/constants/shared";
import "./styles.scss";
export function ControleDeFrequencia() {
  const [mesesAnos, setMesesAnos] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [erroAPI, setErroAPI] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [filtros, setFiltros] = useState({});
  const [totalAlunosPorPeriodo, setTotalAlunosPorPeriodo] = useState(null);
  const [totalMatriculados, setTotalMatriculados] = useState(0);
  const [mesAnoSelecionado, setMesAnoSelecionado] = useState("");
  const [imprimindo, setImprimindo] = useState(false);
  const [exibirModalCentralDownloads, setExibirModalCentralDownloads] =
    useState(false);
  const getMesesAnosAsync = async () => {
    setCarregando(true);
    try {
      const { data } = await getMesesAnos();
      setMesesAnos(data.results);
    } catch (error) {
      setErroAPI(
        "Erro ao carregar meses de referência. Tente novamente mais tarde."
      );
    } finally {
      setCarregando(false);
    }
  };
  const getFiltrosAsync = async (mesSelecionado) => {
    setMesAnoSelecionado(mesSelecionado);
    const [mes, ano] = mesSelecionado.split("_");
    setCarregando(true);
    try {
      const { data } = await getFiltros(mes, ano);
      setPeriodos(data.periodos);
      setDataInicial(data.data_inicial);
      setDataFinal(data.data_final);
    } catch (error) {
      setErroAPI("Erro ao carregar períodos. Tente novamente mais tarde.");
    } finally {
      setCarregando(false);
    }
  };
  const validaPeriodos = (valores) => {
    if (!valores) {
      return JSON.stringify(periodos.map((periodo) => periodo.uuid));
    }
    return JSON.stringify(valores);
  };
  const validaDatas = (data_inicial, data_final) => {
    if (!data_inicial && !data_final) {
      return {
        data_inicial: dataInicial,
        data_final: dataFinal,
      };
    } else if (data_inicial && !data_final) {
      return {
        data_inicial,
        data_final: data_inicial,
      };
    } else if (!data_inicial && data_final) {
      return {
        data_inicial: data_final,
        data_final,
      };
    } else {
      return {
        data_inicial,
        data_final,
      };
    }
  };
  const getAlunosMatriculados = async (filtros) => {
    setCarregando(true);
    try {
      const periodos = validaPeriodos(filtros.periodos);
      const datas = validaDatas(filtros.data_inicial, filtros.data_final);
      const params = {
        periodos,
        ...datas,
      };
      const { data } = await getTotalAlunosMatriculados(params);
      setTotalAlunosPorPeriodo(data.periodos);
      setTotalMatriculados(data.total_matriculados);
    } catch (error) {
      setErroAPI(
        "Erro ao carregar os dados dos alunos matriculados. Tente novamente mais tarde."
      );
    } finally {
      setCarregando(false);
    }
  };
  const getTitulo = () => {
    const dataInicialFormatada = filtros.data_inicial
      ? formataData(filtros.data_inicial, "YYYY-MM-DD", "DD/MM/YYYY")
      : null;
    const dataFinalFormatada = filtros.data_final
      ? formataData(filtros.data_final, "YYYY-MM-DD", "DD/MM/YYYY")
      : null;
    if (filtros.data_inicial && filtros.data_final) {
      if (filtros.data_inicial === filtros.data_final)
        return `EM ${dataInicialFormatada}`;
      return `ENTRE ${dataInicialFormatada} E ${dataFinalFormatada}`;
    } else if (filtros.data_inicial || filtros.data_final) {
      return `EM ${dataInicialFormatada || dataFinalFormatada}`;
    } else {
      return `EM ${dataAtualDDMMYYYY()}`;
    }
  };
  const mesAnoFiltrado = filtros.mes_ano ? filtros.mes_ano.split("_") : null;
  useEffect(() => {
    getMesesAnosAsync();
  }, []);
  const imprimirPDF = async () => {
    setImprimindo(true);
    try {
      const periodos = validaPeriodos(filtros.periodos);
      const dataInicial = () => {
        if (!filtros.data_inicial && filtros.data_final) {
          return filtros.data_final;
        } else {
          return filtros.data_inicial;
        }
      };
      const dataFinal = () => {
        if (filtros.data_inicial && !filtros.data_final) {
          return filtros.data_inicial;
        } else {
          return filtros.data_final;
        }
      };
      const params = {
        periodos,
        mes_ano: mesAnoSelecionado,
        data_inicial: dataInicial(),
        data_final: dataFinal(),
      };
      await imprimirRelatorioControleFrequencia(params);
      setExibirModalCentralDownloads(true);
    } catch (e) {
      toastError("Erro ao imprimir pdf. Tente novamente mais tarde.");
    }
    setImprimindo(false);
  };
  return _jsxs("div", {
    className: "controle-de-frequencia",
    children: [
      erroAPI && _jsx("div", { children: erroAPI }),
      _jsx(Spin, {
        tip: "Carregando...",
        spinning: carregando,
        children: !erroAPI
          ? _jsx("div", {
              className: "card mt-3",
              children: _jsxs("div", {
                className: "card-body",
                children: [
                  _jsx(Filtros, {
                    onSubmit: (values) => {
                      setFiltros(values);
                      getAlunosMatriculados(values);
                    },
                    onClear: () => {
                      setFiltros({});
                      setTotalAlunosPorPeriodo(null);
                      setTotalMatriculados(0);
                    },
                    mesesAnos: mesesAnos,
                    periodos: periodos,
                    getOpcoesFiltros: getFiltrosAsync,
                    dataInicial: dataInicial,
                    dataFinal: dataFinal,
                  }),
                  _jsxs("div", {
                    className: "mt-4",
                    children: [
                      totalMatriculados === 0 &&
                        !carregando &&
                        filtros.mes_ano &&
                        _jsx("div", {
                          className: "text-center mt-4 mb-4",
                          children: "Nenhum resultado encontrado",
                        }),
                      totalMatriculados !== 0 &&
                        _jsxs("div", {
                          className: "mt-4 mb-4",
                          children: [
                            _jsxs("div", {
                              className: "titulo-botao mt-4 mb-3",
                              children: [
                                _jsxs("div", {
                                  className: "container-titulo",
                                  children: [
                                    _jsx("p", {
                                      children: `TOTAL DE MATRICULADOS NA UNIDADE ${getTitulo()}:`,
                                    }),
                                    _jsx("span", {
                                      className: "card-total",
                                      children: totalMatriculados,
                                    }),
                                  ],
                                }),
                                _jsx("div", {
                                  children: _jsx(Botao, {
                                    className: "ms-3 float-end",
                                    texto: "Imprimir",
                                    style: BUTTON_STYLE.GREEN_OUTLINE,
                                    icon: BUTTON_ICON.PRINT,
                                    type: BUTTON_TYPE.BUTTON,
                                    disabled: imprimindo,
                                    onClick: imprimirPDF,
                                  }),
                                }),
                              ],
                            }),
                            Object.entries(totalAlunosPorPeriodo).map(
                              ([index, valor]) => {
                                return _jsxs(
                                  "div",
                                  {
                                    className: "row container-cards mb-4",
                                    children: [
                                      _jsxs("div", {
                                        className: `card-total-matriculados-periodo periodo-${index.trim()}`,
                                        children: [
                                          _jsxs("p", {
                                            children: [
                                              "MATRICULADOS ",
                                              _jsxs("strong", {
                                                children: [
                                                  "PER\u00CDODO ",
                                                  index,
                                                ],
                                              }),
                                            ],
                                          }),
                                          _jsx("span", {
                                            className: "card-total",
                                            children: valor,
                                          }),
                                        ],
                                      }),
                                      _jsx("div", {
                                        className: "mes-ano",
                                        children: `Mês: ${MESES[
                                          Number(mesAnoFiltrado[0]) - 1
                                        ].toUpperCase()}/${mesAnoFiltrado[1]}`,
                                      }),
                                    ],
                                  },
                                  index
                                );
                              }
                            ),
                          ],
                        }),
                    ],
                  }),
                ],
              }),
            })
          : null,
      }),
      _jsx(ModalSolicitacaoDownload, {
        show: exibirModalCentralDownloads,
        setShow: setExibirModalCentralDownloads,
      }),
    ],
  });
}
