import { Container } from "components/AlteracaoDeCardapio/Escola/components/Container";
import Breadcrumb from "components/Shareable/Breadcrumb";
import Page from "components/Shareable/Page/Page";
import React from "react";
import { HOME } from "./constants";

const atual = {
  href: "/escola/alteracao-do-tipo-de-alimentacao",
  titulo: "Alteração do Tipo de Alimentação",
};

export default () => (
  <Page titulo={atual.titulo} botaoVoltar>
    <Breadcrumb home={HOME} atual={atual} />
    <Container />
  </Page>
);
