import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import { CARGAS_USUARIOS, CONFIGURACOES } from "src/configs/constants";
import CargasUsuarios from "src/components/screens/Configuracoes/CargasUsuarios";

const atual = {
  href: `/${CONFIGURACOES}/${CARGAS_USUARIOS}`,
  titulo: "Cargas de Usuários",
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
    <CargasUsuarios />
  </Page>
);
