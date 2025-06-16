import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  CONFERIR_ENTREGA,
  REPOSICAO_GUIA,
  LOGISTICA,
} from "src/configs/constants";
import ReposicaoDeGuia from "src/components/screens/Logistica/ReposicaoDeGuia";

const atual = {
  href: `/${LOGISTICA}/${REPOSICAO_GUIA}`,
  titulo: "Reposição de alimentos faltantes",
};

const anteriores = [
  {
    href: `/`,
    titulo: "Abastecimento",
  },
  {
    href: `/${LOGISTICA}/${CONFERIR_ENTREGA}`,
    titulo: "Conferir Entrega",
  },
];

export default () => (
  <Page
    botaoVoltar
    voltarPara={`/${LOGISTICA}/${CONFERIR_ENTREGA}`}
    titulo={atual.titulo}
  >
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
    <ReposicaoDeGuia />
  </Page>
);
