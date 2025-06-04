import React from "react";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import CadastroGeral from "src/components/screens/Cadastros/CadastroGeral";
import Page from "src/components/Shareable/Page/Page";
import { CADASTROS, CONFIGURACOES, FABRICANTES } from "src/configs/constants";

const atual = {
  href: `/${CONFIGURACOES}/${CADASTROS}/${FABRICANTES}`,
  titulo: "Fabricantes",
};

export default () => (
  <Page titulo={atual.titulo} botaoVoltar voltarPara={`/`}>
    <Breadcrumb home={"/"} atual={atual} />
    <CadastroGeral tipoFixo={"FABRICANTE"} />
  </Page>
);
