import React from "react";

import { HOME } from "src/constants/config";
import { RECEBIMENTO, FICHA_RECEBIMENTO } from "src/configs/constants";
import Page from "src/components/Shareable/Page/Page";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import FichaRecebimento from "src/components/screens/Recebimento/FichaRecebimento";

const atual = {
  href: `/${RECEBIMENTO}/${FICHA_RECEBIMENTO}`,
  titulo: "Ficha de Recebimento",
};

const anteriores = [
  {
    href: `/`,
    titulo: "Recebimento",
  },
];

export default () => (
  <Page
    botaoVoltar
    voltarPara={anteriores[anteriores.length - 1].href}
    titulo={atual.titulo}
  >
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
    <FichaRecebimento />
  </Page>
);
