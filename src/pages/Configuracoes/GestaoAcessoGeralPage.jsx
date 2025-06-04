import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import { GESTAO_ACESSO_GERAL, CONFIGURACOES } from "src/configs/constants";
import GestaoAcesso from "src/components/screens/Configuracoes/GestaoAcesso";

const atual = {
  href: `/${CONFIGURACOES}/${GESTAO_ACESSO_GERAL}`,
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
    <GestaoAcesso geral />
  </Page>
);
