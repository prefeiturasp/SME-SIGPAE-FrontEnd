import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import { PAINEL_APROVACOES, PRE_RECEBIMENTO } from "src/configs/constants";
import PainelAprovacoes from "src/components/screens/PreRecebimento/PainelAprovacoes";

const atual = {
  href: `/${PRE_RECEBIMENTO}/${PAINEL_APROVACOES}`,
  titulo: "Painel de Aprovações",
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
    <PainelAprovacoes />
  </Page>
);
