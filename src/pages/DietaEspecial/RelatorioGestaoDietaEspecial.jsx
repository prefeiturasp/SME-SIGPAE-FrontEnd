import React from "react";

import { HOME } from "src/constants/config";

import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";

import RelatorioGestaoDietaEspecial from "src/components/screens/DietaEspecial/RelatorioGestaoDietaEspecial";
import {
  DIETA_ESPECIAL,
  RELATORIO_GESTAO_DIETA_ESPECIAL,
} from "src/configs/constants";

const atual = {
  href: `/${DIETA_ESPECIAL}/${RELATORIO_GESTAO_DIETA_ESPECIAL}`,
  titulo: "Relatório de Gestão Dieta Especial",
};

export default () => (
  <Page botaoVoltar voltarPara="/" titulo={atual.titulo}>
    <Breadcrumb home={HOME} atual={atual} />
    <RelatorioGestaoDietaEspecial />
  </Page>
);
