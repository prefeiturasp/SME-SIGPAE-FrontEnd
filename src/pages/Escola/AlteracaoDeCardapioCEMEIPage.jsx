import Container from "src/components/AlteracaoDeCardapioCEMEI/componentes/Container";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import { ALTERACAO_TIPO_ALIMENTACAO, ESCOLA } from "src/configs/constants";
import React from "react";
import { HOME } from "./constants";

const atual = {
  href: `/${ESCOLA}/${ALTERACAO_TIPO_ALIMENTACAO}`,
  titulo: "Alteração do Tipo de Alimentação",
};

export const AlteracaoDeCardapioCEMEIPage = () => (
  <Page titulo={atual.titulo} botaoVoltar>
    <Breadcrumb home={HOME} atual={atual} />
    <Container />
  </Page>
);
