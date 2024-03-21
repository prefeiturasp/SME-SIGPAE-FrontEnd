import React from "react";

import { HOME, RECEBIMENTO, QUESTOES_POR_PRODUTO } from "constants/config";
import Page from "components/Shareable/Page/Page";
import Breadcrumb from "components/Shareable/Breadcrumb";

const atual = {
  href: `/${RECEBIMENTO}/${QUESTOES_POR_PRODUTO}`,
  titulo: "Questões por Produto",
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
    <></>
  </Page>
);
