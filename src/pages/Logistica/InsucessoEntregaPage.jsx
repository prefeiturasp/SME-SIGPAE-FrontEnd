import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import { INSUCESSO_ENTREGA, LOGISTICA } from "src/configs/constants";
import InsucessoEntrega from "src/components/screens/Logistica/InsucessoEntrega";

const atual = {
  href: `/${LOGISTICA}/${INSUCESSO_ENTREGA}`,
  titulo: "Insucesso de Entrega",
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
    <InsucessoEntrega />
  </Page>
);
