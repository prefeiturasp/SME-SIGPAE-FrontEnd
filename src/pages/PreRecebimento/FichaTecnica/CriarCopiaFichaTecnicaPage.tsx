import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  CRIAR_COPIA_FICHA_TECNICA,
  FICHA_TECNICA,
  PRE_RECEBIMENTO,
} from "src/configs/constants";
import Cadastrar from "src/components/screens/PreRecebimento/FichaTecnica/components/Cadastrar";

const atual = {
  href: `/${PRE_RECEBIMENTO}/${CRIAR_COPIA_FICHA_TECNICA}`,
  titulo: "Cópia da Ficha Técnica",
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
    temModalVoltar
    voltarPara={`/${PRE_RECEBIMENTO}/${FICHA_TECNICA}`}
    titulo={atual.titulo}
  >
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />

    <Cadastrar ehCopia />
  </Page>
);
