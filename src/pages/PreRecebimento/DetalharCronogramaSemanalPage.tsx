import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import { PRE_RECEBIMENTO, CRONOGRAMA_SEMANAL_FLV } from "src/configs/constants";
import DetalharCronogramaSemanal from "src/components/screens/PreRecebimento/CronogramaSemanalFLV/components/Detalhar";

const atual = {
  href: "",
  titulo: "Detalhamento do Cronograma Semanal",
};

const anteriores = [
  {
    href: "/",
    titulo: "Pré-Recebimento",
  },
  {
    href: `/${PRE_RECEBIMENTO}/${CRONOGRAMA_SEMANAL_FLV}`,
    titulo: "Cronograma Semanal - FLV",
  },
];

export default () => (
  <Page botaoVoltar titulo={atual.titulo}>
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
    <DetalharCronogramaSemanal />
  </Page>
);
