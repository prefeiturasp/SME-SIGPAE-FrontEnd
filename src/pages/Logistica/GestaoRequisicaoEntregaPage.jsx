import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import { GESTAO_REQUISICAO_ENTREGA, LOGISTICA } from "src/configs/constants";
import GestaoRequisicaoEntrega from "src/components/screens/Logistica/GestaoRequisicaoEntrega";

const atual = {
  href: `/${LOGISTICA}/${GESTAO_REQUISICAO_ENTREGA}`,
  titulo: "Requisição de Entrega",
};

const anteriores = [
  {
    href: `/`,
    titulo: "Abastecimento",
  },
];

export default () => (
  <Page botaoVoltar voltarPara="/" titulo={atual.titulo}>
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
    <GestaoRequisicaoEntrega />
  </Page>
);
