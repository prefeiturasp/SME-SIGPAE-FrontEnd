import React from "react";
import Container from "../../components/InclusaoDeAlimentacao/Escola/Formulario/componentes/Container";
import Breadcrumb from "../../components/Shareable/Breadcrumb";
import Page from "../../components/Shareable/Page/Page";
import { ESCOLA, SUSPENSAO_ALIMENTACAO } from "../../configs/constants";
import { HOME } from "./constants";

const atual = {
  href: `/${ESCOLA}/${SUSPENSAO_ALIMENTACAO}`,
  titulo: "Inclusão de Alimentação",
};

export default () => (
  <Page titulo={atual.titulo} pegaAtualmente={true} botaoVoltar>
    <Breadcrumb home={HOME} atual={atual} />
    <Container />
  </Page>
);
