import React from "react";

import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  ALTERAR_FICHA_TECNICA,
  FICHA_TECNICA,
  PRE_RECEBIMENTO,
} from "src/configs/constants";
import Alterar from "src/components/screens/PreRecebimento/FichaTecnica/components/Alterar";

const atual = {
  href: `/${PRE_RECEBIMENTO}/${ALTERAR_FICHA_TECNICA}`,
  titulo: "Alterar Ficha Técnica",
};

const anteriores = [
  {
    href: `/`,
    titulo: "Pré-Recebimento",
  },
  {
    href: `/${PRE_RECEBIMENTO}/${FICHA_TECNICA}`,
    titulo: "Ficha Técnica do Produto",
  },
];

export default () => (
  <Page
    botaoVoltar
    voltarPara={anteriores[anteriores.length - 1].href}
    titulo={atual.titulo}
  >
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
    <Alterar />
  </Page>
);
