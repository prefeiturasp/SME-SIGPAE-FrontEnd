import React from "react";

import { HOME } from "constants/config";

import Breadcrumb from "components/Shareable/Breadcrumb";
import Page from "components/Shareable/Page/Page";

import { RelatorioHistoricoDietas } from "components/screens/DietaEspecial/RelatorioHistoricoDietas";
import { DIETA_ESPECIAL, RELATORIO_HISTORICO_DIETAS } from "configs/constants";

const atual = {
  href: `/${DIETA_ESPECIAL}/${RELATORIO_HISTORICO_DIETAS}`,
  titulo: "Relatório Histórico de Dietas",
};

const anteriores = [
  {
    href: "/painel-dieta-especial",
    titulo: "Dieta Especial",
  },
  {
    href: "#",
    titulo: "Relatórios",
  },
];

export default () => (
  <Page botaoVoltar voltarPara="/" titulo={atual.titulo}>
    <Breadcrumb home={HOME} anteriores={anteriores} atual={atual} />
    <RelatorioHistoricoDietas />
  </Page>
);
