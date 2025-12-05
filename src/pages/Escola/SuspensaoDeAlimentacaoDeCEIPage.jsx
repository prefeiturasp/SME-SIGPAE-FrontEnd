import React from "react";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import { Container } from "../../components/SuspensaoAlimentacaoDeCEI/Container";
import { HOME } from "./constants";

const atual = {
  href: "/escola/suspensao-de-alimentacao",
  titulo: "Suspensão de Alimentação",
};

export default () => (
  <Page titulo={atual.titulo} pegaAtualmente={true} botaoVoltar>
    <Breadcrumb home={HOME} atual={atual} />
    <Container />
  </Page>
);
