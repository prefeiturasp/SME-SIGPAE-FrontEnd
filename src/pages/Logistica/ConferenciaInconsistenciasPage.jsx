import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import { CONFERENCIA_INCONSISTENCIAS, LOGISTICA } from "src/configs/constants";
import ConferenciaInconsistencias from "src/components/screens/Logistica/ConferenciaInconsistencias";

const atual = {
  href: `/${LOGISTICA}/${CONFERENCIA_INCONSISTENCIAS}`,
  titulo: "Conferência de Inconsistência",
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
    <ConferenciaInconsistencias />
  </Page>
);
