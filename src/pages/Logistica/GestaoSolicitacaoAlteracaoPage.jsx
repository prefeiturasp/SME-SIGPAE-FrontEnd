import React from "react";
import { HOME } from "constants/config";
import Breadcrumb from "components/Shareable/Breadcrumb";
import Page from "components/Shareable/Page/Page";
import { GESTAO_SOLICITACAO_ALTERACAO, LOGISTICA } from "configs/constants";
import GestaoSolicitacaoAlteracao from "components/screens/Logistica/GestaoSolicitacaoAlteracao";

const atual = {
  href: `/${LOGISTICA}/${GESTAO_SOLICITACAO_ALTERACAO}`,
  titulo: "Alteração da Requisição"
};

const anteriores = [
  {
    href: `/`,
    titulo: "Abastecimento"
  }
];

export default () => (
  <Page botaoVoltar voltarPara="/" titulo={atual.titulo}>
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
    <GestaoSolicitacaoAlteracao />
  </Page>
);
