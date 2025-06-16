import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import { RELATORIO_CRONOGRAMA, PRE_RECEBIMENTO } from "src/configs/constants";
import RelatorioCronograma from "src/components/screens/PreRecebimento/Relatorios/RelatorioCronograma";

const atual = {
  href: `/${PRE_RECEBIMENTO}/${RELATORIO_CRONOGRAMA}`,
  titulo: "Relatório de Cronogramas de Entregas",
};

const anteriores = [
  {
    href: `/`,
    titulo: "Pré-Recebimento",
  },
  {
    href: `/`,
    titulo: "Relatórios",
  },
];

export default () => (
  <Page botaoVoltar voltarPara="/" titulo={atual.titulo}>
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
    <RelatorioCronograma />
  </Page>
);
