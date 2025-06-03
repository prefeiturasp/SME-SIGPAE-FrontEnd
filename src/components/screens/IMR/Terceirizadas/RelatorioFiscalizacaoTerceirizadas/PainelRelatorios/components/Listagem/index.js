import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from "react/jsx-runtime";
import { useState } from "react";
import { Tooltip } from "antd";
import ModalSolicitacaoDownload from "src/components/Shareable/ModalSolicitacaoDownload";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import {
  DETALHAR_RELATORIO_FISCALIZACAO,
  EDITAR_RELATORIO_FISCALIZACAO,
  RELATORIO_FISCALIZACAO_TERCEIRIZADAS,
  SUPERVISAO,
  TERCEIRIZADAS,
} from "src/configs/constants";
import { truncarString } from "src/helpers/utilities";
import HTTP_STATUS from "http-status-codes";
import {
  deleteFormularioSupervisao,
  exportarPDFRelatorioFiscalizacao,
} from "src/services/imr/relatorioFiscalizacaoTerceirizadas";
import { NavLink } from "react-router-dom";
import "./styles.scss";
const TAMANHO_MAXIMO = 40;
export const Listagem = ({
  objetos,
  perfilNutriSupervisao,
  getDashboardPainelGerencialSupervisaoAsync,
  buscarResultados,
  filtros,
  pagina,
}) => {
  const [exibirModalCentralDownloads, setExibirModalCentralDownloads] =
    useState(false);
  const [requisicaoEmAndamento, setRequisicaoEmAndamento] = useState("");
  const deParaStatus = (status) =>
    ["Enviado para CODAE"].includes(status) && !perfilNutriSupervisao
      ? "Enviado pela Supervisão"
      : status;
  const exportarPDF = async (uuid) => {
    setRequisicaoEmAndamento(uuid);
    const response = await exportarPDFRelatorioFiscalizacao({
      uuid,
    });
    if (response.status === HTTP_STATUS.OK) {
      setExibirModalCentralDownloads(true);
    } else {
      toastError("Erro ao baixar PDF. Tente novamente mais tarde");
    }
    setRequisicaoEmAndamento("");
  };
  const excluirRelatorio = async (uuid) => {
    if (window.confirm("Deseja realmente excluir este relatório?")) {
      setRequisicaoEmAndamento(uuid);
      const response = await deleteFormularioSupervisao({
        uuid,
      });
      if (response.status === HTTP_STATUS.NO_CONTENT) {
        toastSuccess("Relatório excluído com sucesso!");
        await getDashboardPainelGerencialSupervisaoAsync();
        await buscarResultados(filtros, pagina);
      } else {
        toastError("Erro ao excluir relatório. Tente novamente mais tarde");
      }
      setRequisicaoEmAndamento("");
    }
  };
  const renderizarAcoes = (objeto) => {
    const botaoContinuarRelatorio = _jsx(Tooltip, {
      title: "Editar relat\u00F3rio",
      children: _jsx(NavLink, {
        className: "float-start",
        to: `/${SUPERVISAO}/${TERCEIRIZADAS}/${RELATORIO_FISCALIZACAO_TERCEIRIZADAS}/${EDITAR_RELATORIO_FISCALIZACAO}?uuid=${objeto.uuid}`,
        children: _jsx("button", {
          className: "verde",
          children: _jsx("i", { className: "fas fa-edit" }),
        }),
      }),
    });
    const botaoDetalhar = _jsx(Tooltip, {
      title: "Visualizar Relat\u00F3rio",
      children: _jsx(NavLink, {
        className: "float-start",
        to: `/${SUPERVISAO}/${TERCEIRIZADAS}/${RELATORIO_FISCALIZACAO_TERCEIRIZADAS}/${DETALHAR_RELATORIO_FISCALIZACAO}?uuid=${objeto.uuid}`,
        children: _jsx("button", {
          className: "verde",
          children: _jsx("i", { className: "fas fa-eye" }),
        }),
      }),
    });
    const botaoImprimir = _jsx(Tooltip, {
      title: "Relat\u00F3rio em PDF",
      children: _jsxs("button", {
        onClick: () => exportarPDF(objeto.uuid),
        className: "verde",
        disabled: requisicaoEmAndamento === objeto.uuid,
        children: [
          requisicaoEmAndamento !== objeto.uuid &&
            _jsx("i", { className: "fas fa-download" }),
          requisicaoEmAndamento === objeto.uuid &&
            _jsx("img", {
              src: "/assets/image/ajax-loader.gif",
              alt: "ajax-loader",
            }),
        ],
      }),
    });
    const botaoExcluirRelatorio = _jsx(Tooltip, {
      title: "Excluir relat\u00F3rio",
      children: _jsxs("button", {
        onClick: () => excluirRelatorio(objeto.uuid),
        className: "verde",
        disabled: requisicaoEmAndamento === objeto.uuid,
        children: [
          requisicaoEmAndamento !== objeto.uuid &&
            _jsx("i", { className: "fas fa-trash" }),
          requisicaoEmAndamento === objeto.uuid &&
            _jsx("img", {
              src: "/assets/image/ajax-loader.gif",
              alt: "ajax-loader",
            }),
        ],
      }),
    });
    return _jsxs("div", {
      children: [
        objeto.status === "Em Preenchimento" &&
          perfilNutriSupervisao &&
          botaoContinuarRelatorio,
        objeto.status === "Em Preenchimento" &&
          perfilNutriSupervisao &&
          botaoExcluirRelatorio,
        objeto.status === "Enviado para CODAE" &&
          perfilNutriSupervisao &&
          botaoDetalhar,
        objeto.status !== "Em Preenchimento" &&
          perfilNutriSupervisao &&
          botaoImprimir,
      ],
    });
  };
  return _jsxs("div", {
    className: "listagem-relatorios-visita",
    children: [
      _jsx("div", {
        className: "titulo-verde mt-5 mb-3",
        children: "Relat\u00F3rios das Visitas as Unidades Cadastrados",
      }),
      _jsxs("article", {
        children: [
          _jsxs("div", {
            className: "grid-table header-table",
            children: [
              _jsx("div", { children: "Diretoria Regional" }),
              _jsx("div", { children: "Unidade Educacional" }),
              _jsx("div", { children: "Data da Visita" }),
              _jsx("div", { children: "Status" }),
              _jsx("div", { children: "A\u00E7\u00F5es" }),
            ],
          }),
          objetos.map((objeto) => {
            return _jsx(_Fragment, {
              children: _jsxs(
                "div",
                {
                  className: "grid-table body-table",
                  children: [
                    _jsx("div", { children: objeto.diretoria_regional }),
                    _jsx("div", {
                      children: _jsx(Tooltip, {
                        title: objeto.unidade_educacional,
                        children: truncarString(
                          objeto.unidade_educacional,
                          TAMANHO_MAXIMO
                        ),
                      }),
                    }),
                    _jsx("div", { children: objeto.data }),
                    _jsx("div", { children: deParaStatus(objeto.status) }),
                    _jsx("div", {
                      className: "p-0",
                      children: renderizarAcoes(objeto),
                    }),
                  ],
                },
                objeto.uuid
              ),
            });
          }),
        ],
      }),
      _jsx(ModalSolicitacaoDownload, {
        show: exibirModalCentralDownloads,
        setShow: setExibirModalCentralDownloads,
      }),
    ],
  });
};
