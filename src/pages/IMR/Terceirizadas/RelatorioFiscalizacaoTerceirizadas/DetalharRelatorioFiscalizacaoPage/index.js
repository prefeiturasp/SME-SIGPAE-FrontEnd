import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  SUPERVISAO,
  TERCEIRIZADAS,
  DETALHAR_RELATORIO_FISCALIZACAO,
  RELATORIO_FISCALIZACAO_TERCEIRIZADAS,
  PAINEL_RELATORIOS_FISCALIZACAO,
} from "src/configs/constants";
import { NovoRelatorioVisitas } from "src/components/screens/IMR/Terceirizadas/RelatorioFiscalizacaoTerceirizadas/NovoRelatorioVisitas";
export const DetalharRelatorioFiscalizacaoPage = () => {
  const atual = {
    href: `/${SUPERVISAO}/${TERCEIRIZADAS}/${RELATORIO_FISCALIZACAO_TERCEIRIZADAS}/${DETALHAR_RELATORIO_FISCALIZACAO}`,
    titulo: "Detalhar Relatório de Fiscalização Terceirizadas",
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
    {
      href: `/${SUPERVISAO}/${TERCEIRIZADAS}/${PAINEL_RELATORIOS_FISCALIZACAO}`,
      titulo: "Painel de Acompanhamento dos Relatórios",
    },
  ];
  return _jsxs(Page, {
    botaoVoltar: true,
    titulo: atual.titulo,
    children: [
      _jsx(Breadcrumb, { home: HOME, atual: atual, anteriores: anteriores }),
      _jsx(NovoRelatorioVisitas, { somenteLeitura: true }),
    ],
  });
};
