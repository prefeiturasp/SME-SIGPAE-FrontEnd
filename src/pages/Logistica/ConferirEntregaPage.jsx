import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import { CONFERIR_ENTREGA, LOGISTICA } from "src/configs/constants";
import ConferirEntrega from "src/components/screens/Logistica/ConferirEntrega";

const atual = {
  href: `/${LOGISTICA}/${CONFERIR_ENTREGA}`,
  titulo: "Conferir Entrega",
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
    <ConferirEntrega />
  </Page>
);
