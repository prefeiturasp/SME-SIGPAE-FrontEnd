import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  RELATORIO_CRONOGRAMA_SEMANAL,
  PRE_RECEBIMENTO,
} from "src/configs/constants";
import RelatorioCronogramaSemanal from "src/components/screens/PreRecebimento/Relatorios/RelatorioCronogramaSemanal";

const atual = {
  href: `/${PRE_RECEBIMENTO}/${RELATORIO_CRONOGRAMA_SEMANAL}`,
  titulo: "Relatório de Cronogramas Semanais",
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
    <RelatorioCronogramaSemanal />
  </Page>
);
