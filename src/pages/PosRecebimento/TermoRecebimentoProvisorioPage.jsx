import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  POS_RECEBIMENTO,
  TERMO_RECEBIMENTO_PROVISORIO,
} from "src/configs/constants";
import TermoRecebimentoProvisorio from "src/components/screens/PosRecebimento/TermoRecebimentoProvisorio";

const atual = {
  href: `/${POS_RECEBIMENTO}/${TERMO_RECEBIMENTO_PROVISORIO}`,
  titulo: "Termo de Recebimento Provisório",
};

const anteriores = [
  {
    href: `/`,
    titulo: "Pós-Recebimento",
  },
];

export default () => (
  <Page botaoVoltar voltarPara="/" titulo={atual.titulo}>
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
    <TermoRecebimentoProvisorio />
  </Page>
);
