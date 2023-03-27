import React from "react";
import { HOME } from "constants/config";
import Breadcrumb from "components/Shareable/Breadcrumb";
import Page from "components/Shareable/Page/Page";
import {
  ALTERACAO_CRONOGRAMA,
  PRE_RECEBIMENTO,
  SOLICITACAO_ALTERACAO_CRONOGRAMA
} from "configs/constants";
import AlterarCronograma from "components/screens/PreRecebimento/AlterarCronograma";

const atual = {
  href: `/${PRE_RECEBIMENTO}/${ALTERACAO_CRONOGRAMA}`,
  titulo: "Analisar Solicitação de Alteração"
};

const anteriores = [
  {
    href: `/`,
    titulo: "Pré-Recebimento"
  }
];

export default () => (
  <Page
    botaoVoltar
    voltarPara={`/${PRE_RECEBIMENTO}/${SOLICITACAO_ALTERACAO_CRONOGRAMA}`}
    titulo={atual.titulo}
  >
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
    <AlterarCronograma analiseSolicitacao={true} />
  </Page>
);
