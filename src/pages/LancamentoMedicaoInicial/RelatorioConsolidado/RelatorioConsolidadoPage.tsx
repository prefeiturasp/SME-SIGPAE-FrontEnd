import React from "react";
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

export const RelatorioConsolidadoPage = () => (
  <Page titulo="Relatório Consolidado Resumido" botaoVoltar>
    <Breadcrumb home={"/"} anteriores={anterior} atual={atual} />
    <RelatorioConsolidado />
  </Page>
);
