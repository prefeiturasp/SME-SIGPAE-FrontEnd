import React from "react";
import Breadcrumb from "../../../components/Shareable/Breadcrumb";
import Page from "../../../components/Shareable/Page/Page";
import Container from "../../../components/SolicitacaoDeKitLanche/Terceirizada/PainelPedidos/Container";
import { HOME } from "../constants";
import { SOLICITACAO_KIT_LANCHE } from "../../../configs/constants";

const atual = {
  href: `${SOLICITACAO_KIT_LANCHE}`,
  titulo: "Solicitação de Kit Lanche Passeio - Pendente Ciência",
};

export const PainelPedidosPage = () => (
  <Page titulo={atual.titulo} botaoVoltar>
    <Breadcrumb home={HOME} atual={atual} />
    <Container />
  </Page>
);
