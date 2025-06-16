import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  DISPONIBILIZACAO_DE_SOLICITACOES,
  LOGISTICA,
} from "src/configs/constants";
import { DisponibilizacaoDeSolicitacoes } from "src/components/screens/Logistica/DisponibilizacaoDeSolicitacoes";

const atual = {
  href: `/${LOGISTICA}/${DISPONIBILIZACAO_DE_SOLICITACOES}`,
  titulo: "Disponibilização de Solicitações",
};

const anteriores = [
  {
    href: `/`,
    titulo: "Abastecimento",
  },
];

export default () => (
  <Page botaoVoltar voltarPara="/" titulo={atual.titulo}>
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
    <DisponibilizacaoDeSolicitacoes />
  </Page>
);
