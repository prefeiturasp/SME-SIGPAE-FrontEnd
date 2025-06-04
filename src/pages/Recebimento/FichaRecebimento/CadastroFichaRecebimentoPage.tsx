import React from "react";

import { HOME } from "src/constants/config";
import {
  RECEBIMENTO,
  FICHA_RECEBIMENTO,
  CADASTRO_FICHA_RECEBIMENTO,
} from "src/configs/constants";
import Page from "src/components/Shareable/Page/Page";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Cadastrar from "src/components/screens/Recebimento/FichaRecebimento/components/Cadastrar";

const atual = {
  href: `/${RECEBIMENTO}/${CADASTRO_FICHA_RECEBIMENTO}`,
  titulo: "Cadastrar Recebimento",
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
    <Cadastrar />
  </Page>
);
