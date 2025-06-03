import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from "react/jsx-runtime";
import { Spin } from "antd";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import ModalSolicitacaoDownload from "src/components/Shareable/ModalSolicitacaoDownload";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import HTTP_STATUS from "http-status-codes";
import { useContext, useState } from "react";
import {
  exportarExcelAsyncSolicitacoesRelatorioHistoricoDietas,
  exportarPDFAsyncSolicitacoesRelatorioHistoricoDietas,
} from "src/services/dietaEspecial.service";
import { Filtros } from "./components/Filtros";
import { TabelaHistorico } from "./components/TabelaHistorico";
import { normalizarValues } from "./helper";
import "./styles.scss";
import { MeusDadosContext } from "src/context/MeusDadosContext";
export const RelatorioHistoricoDietas = () => {
  const { meusDados } = useContext(MeusDadosContext);
  const [valuesForm, setValuesForm] = useState(null);
  const [dietasEspeciais, setDietasEspeciais] = useState(null);
  const [loadingDietas, setLoadingDietas] = useState(false);
  const [count, setCount] = useState(0);
  const [exibirModalCentralDownloads, setExibirModalCentralDownloads] =
    useState(false);
  const [exportando, setExportando] = useState(false);
  const [erro, setErro] = useState("");
  const exportarExcel = async () => {
    setExportando(true);
    const response =
      await exportarExcelAsyncSolicitacoesRelatorioHistoricoDietas(
        normalizarValues(valuesForm)
      );
    if (response.status === HTTP_STATUS.OK) {
      setExibirModalCentralDownloads(true);
    } else {
      toastError("Erro ao exportar excel. Tente novamente mais tarde.");
    }
    setExportando(false);
  };
  const exportarPDF = async () => {
    setExportando(true);
    const response = await exportarPDFAsyncSolicitacoesRelatorioHistoricoDietas(
      normalizarValues(valuesForm)
    );
    if (response.status === HTTP_STATUS.OK) {
      setExibirModalCentralDownloads(true);
    } else {
      toastError("Erro ao exportar PDF. Tente novamente mais tarde.");
    }
    setExportando(false);
  };
  return _jsxs(_Fragment, {
    children: [
      erro && _jsx("div", { children: erro }),
      !erro &&
        meusDados &&
        _jsxs("div", {
          className: "card mt-3",
          children: [
            _jsx("div", {
              className: "card-body",
              children: _jsxs(Spin, {
                spinning: loadingDietas,
                tip: "Carregando hist\u00F3rico...",
                children: [
                  _jsx(Filtros, {
                    meusDados: meusDados,
                    setDietasEspeciais: setDietasEspeciais,
                    setValuesForm: setValuesForm,
                    setCount: setCount,
                    setLoadingDietas: setLoadingDietas,
                    setErro: setErro,
                  }),
                  dietasEspeciais &&
                    _jsxs(_Fragment, {
                      children: [
                        _jsx("div", {
                          className: "row",
                          children: _jsx("div", {
                            className: "mt-4 pl-0",
                            children: _jsx("p", {
                              className: "mb-2 texto-verde",
                              children: _jsxs("b", {
                                children: [
                                  "Resultado da pesquisa - TOTAL DE DIETAS AUTORIZADAS EM",
                                  " ",
                                  dietasEspeciais.data,
                                  ":",
                                  "  ",
                                  dietasEspeciais.total_dietas,
                                ],
                              }),
                            }),
                          }),
                        }),
                        _jsx(TabelaHistorico, {
                          dietasEspeciais: dietasEspeciais,
                          setLoadingDietas: setLoadingDietas,
                          setDietasEspeciais: setDietasEspeciais,
                          count: count,
                          setCount: setCount,
                          values: valuesForm,
                        }),
                        _jsx("div", {
                          className: "row",
                          children: _jsxs("div", {
                            className: "col-12 text-end",
                            children: [
                              _jsx(Botao, {
                                texto: "Exportar PDF",
                                style: BUTTON_STYLE.GREEN,
                                type: BUTTON_TYPE.BUTTON,
                                icon: BUTTON_ICON.FILE_PDF,
                                onClick: async () => await exportarPDF(),
                                disabled: exportando,
                              }),
                              _jsx(Botao, {
                                texto: "Exportar XLSX",
                                style: BUTTON_STYLE.GREEN,
                                type: BUTTON_TYPE.BUTTON,
                                icon: BUTTON_ICON.FILE_EXCEL,
                                className: "ms-3",
                                onClick: async () => await exportarExcel(),
                                disabled: exportando,
                              }),
                            ],
                          }),
                        }),
                      ],
                    }),
                ],
              }),
            }),
            _jsx(ModalSolicitacaoDownload, {
              show: exibirModalCentralDownloads,
              setShow: setExibirModalCentralDownloads,
            }),
          ],
        }),
    ],
  });
};
export default RelatorioHistoricoDietas;
