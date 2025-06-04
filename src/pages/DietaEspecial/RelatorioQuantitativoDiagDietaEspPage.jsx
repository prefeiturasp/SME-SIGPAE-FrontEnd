import React from "react";

import { HOME } from "src/constants/config";

import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";

import RelatorioQuantitativoDiagDietaEsp from "src/components/screens/DietaEspecial/RelatorioQuantitativoDiagDietaEsp";
import {
  DIETA_ESPECIAL,
  RELATORIO_QUANTITATIVO_SOLIC_DIETA_ESP,
} from "src/configs/constants";

const atual = {
  href: `/${DIETA_ESPECIAL}/${RELATORIO_QUANTITATIVO_SOLIC_DIETA_ESP}`,
  titulo: "Relatório Quantitativo por Diagnóstico de Dieta Especial",
};

export default () => (
  <Page botaoVoltar voltarPara="/" titulo={atual.titulo}>
    <Breadcrumb home={HOME} atual={atual} />
    <RelatorioQuantitativoDiagDietaEsp />
  </Page>
);
