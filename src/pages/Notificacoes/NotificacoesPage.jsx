import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import { NOTIFICACOES } from "src/configs/constants";
import Notificacoes from "src/components/screens/Notificacoes";

const atual = {
  href: `/${NOTIFICACOES}`,
  titulo: "Notificações",
};

export default () => (
  <Page botaoVoltar voltarPara="/" titulo={atual.titulo}>
    <Breadcrumb home={HOME} atual={atual} />
    <Notificacoes />
  </Page>
);
