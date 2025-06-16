import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  SOLICITACAO_ALTERACAO_CRONOGRAMA_FORNECEDOR,
  PRE_RECEBIMENTO,
} from "src/configs/constants";
import SolicitacaoAlteracaoCronograma from "src/components/screens/PreRecebimento/SolicitacaoAlteracaoCronograma";

const atual = {
  href: `/${PRE_RECEBIMENTO}/${SOLICITACAO_ALTERACAO_CRONOGRAMA_FORNECEDOR}`,
  titulo: "Verificar Alterações de Cronograma",
};

const anteriores = [
  {
    href: `/`,
    titulo: "Pré-Recebimento",
  },
];

export default () => (
  <Page botaoVoltar voltarPara="/" titulo={atual.titulo}>
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
    <SolicitacaoAlteracaoCronograma fornecedor />
  </Page>
);
