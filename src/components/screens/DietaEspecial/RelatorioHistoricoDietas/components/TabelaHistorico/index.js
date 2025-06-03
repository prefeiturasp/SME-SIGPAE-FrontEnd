import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from "react/jsx-runtime";
import { Paginacao } from "src/components/Shareable/Paginacao";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import HTTP_STATUS from "http-status-codes";
import { useState } from "react";
import { getSolicitacoesRelatorioHistoricoDietas } from "src/services/dietaEspecial.service";
import { normalizarValues, PAGE_SIZE } from "../../helper";
import { CollapseContentCEI } from "../CollapseContentCEI";
import { CollapseContentCEMEI } from "../CollapseContentCEMEI";
import { CollapseContentEMEBS } from "../CollapseContentEMEBS";
import { CollapseContentEMEI } from "../CollapseContentEMEI";
import "./styles.scss";
export const TabelaHistorico = ({ ...props }) => {
  const [paginaAtual, setPaginaAtual] = useState(1);
  const {
    dietasEspeciais,
    setDietasEspeciais,
    setLoadingDietas,
    count,
    setCount,
    values,
  } = props;
  const onChangePage = async (page, values) => {
    setPaginaAtual(page);
    setLoadingDietas(true);
    const params = normalizarValues(values, page);
    const response = await getSolicitacoesRelatorioHistoricoDietas(params);
    if (response.status === HTTP_STATUS.OK) {
      setDietasEspeciais(response.data);
      setCount(response.data.count);
    } else {
      toastError(
        "Erro ao carregar dados das dietas especiais. Tente novamente mais tarde."
      );
    }
    setLoadingDietas(false);
  };
  const unidades = dietasEspeciais.results;
  const renderRows = () => {
    return unidades.map((unidade, indexDieta) => {
      return _jsx(
        RowWithCollapse,
        {
          unidade: unidade,
          data: dietasEspeciais.data,
          tipoUnidade: unidade.tipo_unidade,
        },
        indexDieta
      );
    });
  };
  return _jsxs("section", {
    className: "tabela-historico-dietas",
    children: [
      _jsxs("article", {
        children: [
          _jsxs("div", {
            className: `grid-table-rel-dietas header-table`,
            children: [
              _jsx("div", { children: "DRE/Lote" }),
              _jsx("div", { children: "Unidade Educacional" }),
              _jsx("div", { children: "Classifica\u00E7\u00E3o da Dieta" }),
              _jsx("div", {
                className: "centralizar",
                children: "Dietas Autorizadas",
              }),
              _jsx("div", {
                className: "centralizar",
                children: "Data de Refer\u00EAncia",
              }),
              _jsx("div", {}),
            ],
          }),
          dietasEspeciais &&
            dietasEspeciais.results.length === 0 &&
            _jsx("div", {
              className: "text-center mt-3",
              children: "Nenhum resultado encontrado.",
            }),
          renderRows(),
        ],
      }),
      _jsx(Paginacao, {
        onChange: (page) => onChangePage(page, values),
        total: count,
        pageSize: PAGE_SIZE,
        current: paginaAtual,
      }),
    ],
  });
};
const RowWithCollapse = ({ unidade, data, tipoUnidade }) => {
  const [showDetail, setShowDetail] = useState(false);
  const UNIDADES_CEI = [
    "CEI DIRET",
    "CEU CEI",
    "CEI",
    "CCI",
    "CCI/CIPS",
    "CEI CEU",
  ];
  const UNIDADES_CEMEI = ["CEMEI", "CEU CEMEI"];
  const UNIDADES_EMEI_EMEF_CIEJA = [
    "EMEI",
    "CEU EMEI",
    "CEU EMEI",
    "EMEF",
    "CEU EMEF",
    "EMEFM",
    "CIEJA",
  ];
  const UNIDADES_EMEBS = ["EMEBS"];
  const UNIDADES_SEM_PERIODOS = ["CMCT", "CEU GESTAO"];
  const shouldRenderCollapse =
    !UNIDADES_SEM_PERIODOS.includes(tipoUnidade) && unidade.total > 0;
  const renderCollapseContent = (tipoUnidade, periodos) => {
    if (UNIDADES_CEI.includes(tipoUnidade)) {
      return _jsx(CollapseContentCEI, { periodos: periodos });
    }
    if (UNIDADES_EMEI_EMEF_CIEJA.includes(tipoUnidade)) {
      return _jsx(CollapseContentEMEI, { periodos: periodos });
    }
    if (UNIDADES_CEMEI.includes(tipoUnidade)) {
      return _jsx(CollapseContentCEMEI, { periodos: periodos });
    }
    if (UNIDADES_EMEBS.includes(tipoUnidade)) {
      return _jsx(CollapseContentEMEBS, { periodos: periodos });
    }
  };
  return _jsxs(_Fragment, {
    children: [
      _jsxs("div", {
        className: `grid-table-rel-dietas body-table row-dieta`,
        children: [
          _jsx("div", {
            className: "div-tabela-historico",
            children: unidade.lote,
          }),
          _jsx("div", {
            className: "div-tabela-historico",
            children: unidade.unidade_educacional,
          }),
          _jsx("div", {
            className: "div-tabela-historico",
            children: unidade.classificacao,
          }),
          _jsx("div", {
            className: "div-tabela-historico centralizar",
            children: unidade.total,
          }),
          _jsx("div", {
            className: "div-tabela-historico centralizar",
            children: data,
          }),
          _jsx("div", {
            className: "div-tabela-historico centralizar",
            children:
              shouldRenderCollapse &&
              _jsx("i", {
                className: `fas fa-${showDetail ? "angle-up" : "angle-down"}`,
                onClick: () => setShowDetail(!showDetail),
                style: { cursor: "pointer" },
              }),
          }),
        ],
      }),
      shouldRenderCollapse &&
        showDetail &&
        _jsx("div", {
          children: renderCollapseContent(tipoUnidade, unidade.periodos),
        }),
    ],
  });
};
