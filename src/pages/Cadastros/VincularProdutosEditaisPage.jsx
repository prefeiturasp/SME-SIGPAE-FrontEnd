import React from "react";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import VincularProdutosEditais from "src/components/screens/Cadastros/VincularProdutosEditais";
import Page from "src/components/Shareable/Page/Page";

const atual = {
  href: `/gestao-produto/vincular-produto-edital`,
  titulo: "Vincular Produtos aos Editais",
};

export default () => (
  <Page titulo={atual.titulo} botaoVoltar voltarPara={`/`}>
    <Breadcrumb home={"/"} atual={atual} />
    <VincularProdutosEditais />
  </Page>
);
