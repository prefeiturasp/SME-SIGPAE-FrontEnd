import React from "react";

import { HOME } from "src/constants/config";

import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";

import RelatorioQuantitativoClassificacaoDietaEsp from "src/components/screens/DietaEspecial/RelatorioQuantitativoClassificacaoDietaEsp";
import {
  DIETA_ESPECIAL,
  RELATORIO_QUANTITATIVO_CLASSIFICACAO_DIETA_ESP,
} from "src/configs/constants";

const atual = {
  href: `/${DIETA_ESPECIAL}/${RELATORIO_QUANTITATIVO_CLASSIFICACAO_DIETA_ESP}`,
  titulo: "Relatório Quantitativo por Classificação da Dieta Especial",
};

export default () => (
  <Page botaoVoltar voltarPara="/" titulo={atual.titulo}>
    <Breadcrumb home={HOME} atual={atual} />
    <RelatorioQuantitativoClassificacaoDietaEsp />
  </Page>
);
