import React from "react";

import { HOME } from "src/constants/config";
import {
  RECEBIMENTO,
  FICHA_RECEBIMENTO,
  DETALHAR_FICHA_RECEBIMENTO,
} from "src/configs/constants";
import Page from "src/components/Shareable/Page/Page";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Detalhar from "src/components/screens/Recebimento/FichaRecebimento/components/Detalhar";

const atual = {
  href: `/${RECEBIMENTO}/${DETALHAR_FICHA_RECEBIMENTO}`,
  titulo: "Detalhar Ficha de Recebimento",
};

const anteriores = [
  {
    href: `/`,
    titulo: "Recebimento",
  },
  {
    href: `/${RECEBIMENTO}/${FICHA_RECEBIMENTO}`,
    titulo: "Ficha de Recebimento",
  },
];

export default () => (
  <Page
    botaoVoltar
    voltarPara={anteriores[anteriores.length - 1].href}
    titulo={atual.titulo}
  >
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
    <Detalhar />
  </Page>
);
