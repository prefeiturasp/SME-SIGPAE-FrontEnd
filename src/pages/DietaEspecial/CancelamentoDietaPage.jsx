import React from "react";

import { HOME } from "src/constants/config";

import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";

import CancelamentoDieta from "src/components/screens/DietaEspecial/CancelamentoDieta";
import { DIETA_ESPECIAL, CANCELAMENTO } from "src/configs/constants";

const atual = {
  href: `/${DIETA_ESPECIAL}/${CANCELAMENTO}`,
  titulo: "Cancelamento de Dieta Especial",
};

export const CancelamentoDietaPage = () => (
  <Page botaoVoltar voltarPara="/" titulo={atual.titulo}>
    <Breadcrumb home={HOME} atual={atual} />
    <CancelamentoDieta />
  </Page>
);
