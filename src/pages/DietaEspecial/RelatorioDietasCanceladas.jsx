import React from "react";

import { HOME } from "src/constants/config";

import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";

import { RelatorioDietasCanceladas } from "src/components/screens/DietaEspecial/RelatorioDietasCanceladas";
import {
  DIETA_ESPECIAL,
  RELATORIO_DIETAS_CANCELADAS,
} from "src/configs/constants";

const atual = {
  href: `/${DIETA_ESPECIAL}/${RELATORIO_DIETAS_CANCELADAS}`,
  titulo: "Relatório de Dietas Canceladas",
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
    <RelatorioDietasCanceladas />
  </Page>
);
