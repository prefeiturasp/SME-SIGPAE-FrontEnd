import React from "react";

import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import MemorandoOcorrencias from "src/components/screens/PosRecebimento/MemorandoOcorrencias";
import { HOME } from "src/constants/config";
import { MEMORANDO_OCORRENCIAS, POS_RECEBIMENTO } from "src/configs/constants";

const atual = {
  href: `/${POS_RECEBIMENTO}/${MEMORANDO_OCORRENCIAS}`,
  titulo: "Memorando de Ocorrências",
};

const anteriores = [
  {
    href: "/",
    titulo: "Pós-Recebimento",
  },
];

export default () => (
  <Page titulo={atual.titulo}>
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
    <MemorandoOcorrencias />
  </Page>
);
