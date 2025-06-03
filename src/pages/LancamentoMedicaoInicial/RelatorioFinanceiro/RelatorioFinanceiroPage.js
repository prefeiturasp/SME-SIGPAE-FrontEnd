import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import { MEDICAO_INICIAL, RELATORIO_FINANCEIRO } from "src/configs/constants";
import { RelatorioFinanceiro } from "src/components/screens/LancamentoInicial/RelatorioFinanceiro";
const atual = {
  href: `/${MEDICAO_INICIAL}/${RELATORIO_FINANCEIRO}`,
  titulo: "Relatório Financeiro",
};
const anterior = [
  {
    href: "#",
    titulo: "Medição Inicial",
  },
];
export const RelatorioFinanceiroPage = () =>
  _jsxs(Page, {
    titulo: atual.titulo,
    botaoVoltar: true,
    voltarPara: "/",
    children: [
      _jsx(Breadcrumb, { home: "/", anteriores: anterior, atual: atual }),
      _jsx(RelatorioFinanceiro, {}),
    ],
  });
