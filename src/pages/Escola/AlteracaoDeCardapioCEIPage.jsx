import Container from "src/components/AlteracaoDeCardapio/CEI/Container";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import React from "react";
import { HOME } from "./constants";

const atual = {
  href: "/escola/alteracao-do-tipo-de-alimentacao",
  titulo: "Alteração do Tipo de Alimentação",
};

export const AlteracaoDeCardapioCEIPage = () => (
  <Page titulo={atual.titulo} pegaAtualmente={true} botaoVoltar>
    <Breadcrumb home={HOME} atual={atual} />
    <Container />
  </Page>
);
