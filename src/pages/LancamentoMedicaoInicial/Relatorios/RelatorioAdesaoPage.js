import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { HOME } from "src/constants/config";
import {
  MEDICAO_INICIAL,
  RELATORIOS,
  RELATORIO_ADESAO,
} from "src/configs/constants";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import RelatorioAdesao from "src/components/screens/LancamentoInicial/Relatorios/RelatorioAdesao";
const anteriores = [
  {
    href: "#",
    titulo: "Medição Inicial",
  },
  {
    href: "#",
    titulo: "Relatórios",
  },
];
const atual = {
  href: `/${MEDICAO_INICIAL}/${RELATORIOS}/${RELATORIO_ADESAO}`,
  titulo: "Relatório de Adesão",
};
export const RelatorioAdesaoPage = () =>
  _jsxs(Page, {
    botaoVoltar: true,
    titulo: "Relatório de Adesão",
    children: [
      _jsx(Breadcrumb, { home: HOME, anteriores: anteriores, atual: atual }),
      _jsx(RelatorioAdesao, {}),
    ],
  });
