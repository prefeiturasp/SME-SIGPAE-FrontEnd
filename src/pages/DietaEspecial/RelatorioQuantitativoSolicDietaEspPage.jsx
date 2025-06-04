import React from "react";

import { HOME } from "src/constants/config";

import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";

import RelatorioQuantitativoSolicDietaEsp from "src/components/screens/DietaEspecial/RelatorioQuantitativoSolicDietaEsp";
import {
  DIETA_ESPECIAL,
  RELATORIO_QUANTITATIVO_SOLIC_DIETA_ESP,
} from "src/configs/constants";

const atual = {
  href: `/${DIETA_ESPECIAL}/${RELATORIO_QUANTITATIVO_SOLIC_DIETA_ESP}`,
  titulo: "Relatório Quantitativo de Solicitações de Dieta Especial",
};

export default () => (
  <Page
    botaoVoltar
    voltarPara="/"
    titulo={"Relatório Quantitativo de Solicitações de Dieta Especial"}
  >
    <Breadcrumb home={HOME} atual={atual} />
    <RelatorioQuantitativoSolicDietaEsp />
  </Page>
);
