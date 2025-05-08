import React from "react";
import { HOME } from "constants/config";
import Breadcrumb from "components/Shareable/Breadcrumb";
import Page from "components/Shareable/Page/Page";
import { GESTAO_ACESSO_MASTER, CONFIGURACOES } from "configs/constants";
import GestaoAcesso from "components/screens/Configuracoes/GestaoAcesso";

const atual = {
  href: `/${CONFIGURACOES}/${GESTAO_ACESSO_MASTER}`,
  titulo: "Gestão de Acesso",
};

const anteriores = [
  {
    href: `/`,
    titulo: "Configurações",
  },
  {
    href: `/`,
    titulo: "Gestão de Usuários",
  },
];

export default () => (
  <Page botaoVoltar voltarPara="/" titulo={atual.titulo}>
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
    <GestaoAcesso master />
  </Page>
);
