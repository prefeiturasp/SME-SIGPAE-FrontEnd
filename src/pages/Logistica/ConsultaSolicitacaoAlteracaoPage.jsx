import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  CONSULTA_SOLICITACAO_ALTERACAO,
  LOGISTICA,
} from "src/configs/constants";
import ConsultaSolicitacaoAlteracao from "src/components/screens/Logistica/ConsultaSolicitacaoAlteracao";

const atual = {
  href: `/${LOGISTICA}/${CONSULTA_SOLICITACAO_ALTERACAO}`,
  titulo: "Solicitação de Alteração",
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
    <ConsultaSolicitacaoAlteracao />
  </Page>
);
