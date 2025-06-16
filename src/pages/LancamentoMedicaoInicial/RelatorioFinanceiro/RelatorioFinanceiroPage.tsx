import React from "react";
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

export const RelatorioFinanceiroPage = () => (
  <Page titulo={atual.titulo} botaoVoltar voltarPara={"/"}>
    <Breadcrumb home={"/"} anteriores={anterior} atual={atual} />
    <RelatorioFinanceiro />
  </Page>
);
