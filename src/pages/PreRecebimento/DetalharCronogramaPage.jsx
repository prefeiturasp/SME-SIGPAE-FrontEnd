import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  CRONOGRAMA_ENTREGA,
  DETALHE_CRONOGRAMA,
  PRE_RECEBIMENTO,
} from "src/configs/constants";
import DetalharCronograma from "src/components/screens/PreRecebimento/CronogramaEntrega/components/DetalharCronograma";

const atual = {
  href: `/${PRE_RECEBIMENTO}/${DETALHE_CRONOGRAMA}`,
  titulo: "Detalhamento do Cronograma de Entrega",
};

const anteriores = [
  {
    href: `/`,
    titulo: "Pré-Recebimento",
  },
  {
    href: `/${PRE_RECEBIMENTO}/${CRONOGRAMA_ENTREGA}`,
    titulo: "Cronograma de Entrega",
  },
];

export default () => (
  <Page botaoVoltar titulo={atual.titulo}>
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
    <DetalharCronograma />
  </Page>
);
