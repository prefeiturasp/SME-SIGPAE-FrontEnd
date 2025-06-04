import React from "react";

import { HOME } from "src/constants/config";

import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";

import { RelatorioHistoricoDietas } from "src/components/screens/DietaEspecial/RelatorioHistoricoDietas";
import {
  DIETA_ESPECIAL,
  RELATORIO_HISTORICO_DIETAS,
} from "src/configs/constants";

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
