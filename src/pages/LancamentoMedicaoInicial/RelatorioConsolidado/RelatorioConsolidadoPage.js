import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  MEDICAO_INICIAL,
  RELATORIO_FINANCEIRO,
  RELATORIO_CONSOLIDADO,
} from "src/configs/constants";
import { RelatorioConsolidado } from "src/components/screens/LancamentoInicial/RelatorioFinanceiro/RelatorioConsolidado";
const atual = {
  href: `/${MEDICAO_INICIAL}/${RELATORIO_FINANCEIRO}/${RELATORIO_CONSOLIDADO}`,
  titulo: "Relatório Consolidado",
};
const anterior = [
  {
    href: "#",
    titulo: "Medição Inicial",
  },
  {
    href: `/${MEDICAO_INICIAL}/${RELATORIO_FINANCEIRO}`,
    titulo: "Relatório Financeiro",
  },
];
export const RelatorioConsolidadoPage = () =>
  _jsxs(Page, {
    titulo: "Relat\u00F3rio Consolidado Resumido",
    botaoVoltar: true,
    children: [
      _jsx(Breadcrumb, { home: "/", anteriores: anterior, atual: atual }),
      _jsx(RelatorioConsolidado, {}),
    ],
  });
