import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  POS_RECEBIMENTO,
  TERMO_RECEBIMENTO_DEFINITIVO,
} from "src/configs/constants";
import TermoRecebimentoDefinitivo from "src/components/screens/PosRecebimento/TermoRecebimentoDefinitivo";

const atual = {
  href: `/${POS_RECEBIMENTO}/${TERMO_RECEBIMENTO_DEFINITIVO}`,
  titulo: "Termo de Recebimento Definitivo",
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
    <TermoRecebimentoDefinitivo />
  </Page>
);
