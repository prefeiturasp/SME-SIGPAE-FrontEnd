import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  SUPERVISAO,
  TERCEIRIZADAS,
  PAINEL_RELATORIOS_FISCALIZACAO,
} from "src/configs/constants";
import { PainelRelatorios } from "src/components/screens/IMR/Terceirizadas/RelatorioFiscalizacaoTerceirizadas/PainelRelatorios";
const atual = {
  href: `/${SUPERVISAO}/${TERCEIRIZADAS}/${PAINEL_RELATORIOS_FISCALIZACAO}`,
  titulo: "Painel de Acompanhamento dos Relatórios",
};
const anteriores = [
  {
    href: `/`,
    titulo: "Supervisão",
  },
  {
    href: `/`,
    titulo: "Terceirizadas",
  },
];
export const PainelRelatoriosPage = () =>
  _jsxs(Page, {
    botaoVoltar: true,
    titulo: atual.titulo,
    children: [
      _jsx(Breadcrumb, { home: HOME, atual: atual, anteriores: anteriores }),
      _jsx(PainelRelatorios, {}),
    ],
  });
