import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import { CADASTRO_NOTIFICACAO, LOGISTICA } from "src/configs/constants";
import CadastroNotificacao from "src/components/screens/Logistica/CadastroNotificacao";

const atual = {
  href: `/${LOGISTICA}/${CADASTRO_NOTIFICACAO}`,
  titulo: "Nova Notificação",
};

const anteriores = [
  {
    href: `/`,
    titulo: "Abastecimento",
  },
];

export default () => (
  <Page botaoVoltar titulo={atual.titulo}>
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
    <CadastroNotificacao />
  </Page>
);
