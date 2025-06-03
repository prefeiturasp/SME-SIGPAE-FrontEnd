import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  SUPERVISAO,
  TERCEIRIZADAS,
  RELATORIO_FISCALIZACAO_TERCEIRIZADAS,
} from "src/configs/constants";
import { ListaRelatorios } from "src/components/screens/IMR/Terceirizadas/RelatorioFiscalizacaoTerceirizadas/ListaRelatorios";
const atual = {
  href: `/${SUPERVISAO}/${TERCEIRIZADAS}/${RELATORIO_FISCALIZACAO_TERCEIRIZADAS}`,
  titulo: "Relatório de Fiscalização Terceirizadas",
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
export const ListaRelatoriosFiscalizacaoTerceirizadasPage = () =>
  _jsxs(Page, {
    botaoVoltar: true,
    titulo: atual.titulo,
    children: [
      _jsx(Breadcrumb, { home: HOME, atual: atual, anteriores: anteriores }),
      _jsx(ListaRelatorios, {}),
    ],
  });
