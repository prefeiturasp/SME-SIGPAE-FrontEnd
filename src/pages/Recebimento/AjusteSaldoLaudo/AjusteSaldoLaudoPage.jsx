import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import { AJUSTE_SALDO_LAUDO, RECEBIMENTO } from "src/configs/constants";
import SaldoLaudo from "src/components/screens/Recebimento/SaldoLaudo";

const atual = {
  href: `/${RECEBIMENTO}/${AJUSTE_SALDO_LAUDO}`,
  titulo: "Ajuste de Saldo de Laudo",
};

const anteriores = [
  {
    href: `/`,
    titulo: "Recebimento",
  },
];

export default () => (
  <Page botaoVoltar voltarPara="/" titulo={atual.titulo}>
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
    <SaldoLaudo />
  </Page>
);
