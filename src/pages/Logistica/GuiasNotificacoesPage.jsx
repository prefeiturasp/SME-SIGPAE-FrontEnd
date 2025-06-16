import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import { GUIAS_NOTIFICACAO, LOGISTICA } from "src/configs/constants";
import GuiasComNotificacoes from "src/components/screens/Logistica/GuiasComNotificacoes";

const atual = {
  href: `/${LOGISTICA}/${GUIAS_NOTIFICACAO}`,
  titulo: "Guias com Notificações",
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
    <GuiasComNotificacoes />
  </Page>
);
