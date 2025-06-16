import React from "react";
import Breadcrumb from "../../components/Shareable/Breadcrumb";
import Laboratorios from "src/components/screens/Cadastros/Laboratorios";
import Page from "../../components/Shareable/Page/Page";
import {
  CADASTROS,
  CONFIGURACOES,
  LABORATORIOS_CADASTRADOS,
} from "../../configs/constants";

const atual = {
  href: `/${CONFIGURACOES}/${CADASTROS}/${LABORATORIOS_CADASTRADOS}`,
  titulo: "Laboratórios",
};

const anteriores = [
  {
    href: `/${CONFIGURACOES}/${CADASTROS}`,
    titulo: "Cadastros",
  },
];

export default () => (
  <Page titulo={atual.titulo} botaoVoltar voltarPara={"/"}>
    <Breadcrumb home={"/"} anteriores={anteriores} atual={atual} />
    <Laboratorios />
  </Page>
);
