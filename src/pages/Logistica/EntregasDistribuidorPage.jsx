import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import { ENTREGAS_DISTRIBUIDOR, LOGISTICA } from "src/configs/constants";
import ConsultaEntregas from "src/components/screens/Logistica/ConsultaEntregas";

const atual = {
  href: `/${LOGISTICA}/${ENTREGAS_DISTRIBUIDOR}`,
  titulo: "Entregas",
};

const anteriores = [
  {
    href: `/`,
    titulo: "Abastecimento",
  },
];

export default () => (
  <Page botaoVoltar voltarPara="/" titulo={atual.titulo}>
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
    <ConsultaEntregas distribuidor />
  </Page>
);
