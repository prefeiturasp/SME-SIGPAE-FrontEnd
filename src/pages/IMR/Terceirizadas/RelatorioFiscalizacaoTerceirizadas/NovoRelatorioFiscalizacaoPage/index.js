import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  SUPERVISAO,
  TERCEIRIZADAS,
  RELATORIO_FISCALIZACAO,
  RELATORIO_FISCALIZACAO_TERCEIRIZADAS,
} from "src/configs/constants";
import { NovoRelatorioVisitas } from "src/components/screens/IMR/Terceirizadas/RelatorioFiscalizacaoTerceirizadas/NovoRelatorioVisitas";
const atual = {
  href: `/${SUPERVISAO}/${TERCEIRIZADAS}/${RELATORIO_FISCALIZACAO_TERCEIRIZADAS}/${RELATORIO_FISCALIZACAO}`,
  titulo: "Novo Relatório de Fiscalização",
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
export const NovoRelatorioFiscalizacaoPage = () =>
  _jsxs(Page, {
    botaoVoltar: true,
    titulo: atual.titulo,
    children: [
      _jsx(Breadcrumb, { home: HOME, atual: atual, anteriores: anteriores }),
      _jsx(NovoRelatorioVisitas, {}),
    ],
  });
