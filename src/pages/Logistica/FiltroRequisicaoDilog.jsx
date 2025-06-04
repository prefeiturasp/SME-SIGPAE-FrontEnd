import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import { ENVIO_REQUISICOES_ENTREGA, LOGISTICA } from "src/configs/constants";
import FiltroRequisicaoDilog from "src/components/screens/Logistica/FiltroRequisicaoDilog";

const atual = {
  href: `/${LOGISTICA}/${ENVIO_REQUISICOES_ENTREGA}`,
  titulo: "Envio de Requisições de Entrega",
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
    <FiltroRequisicaoDilog />
  </Page>
);
