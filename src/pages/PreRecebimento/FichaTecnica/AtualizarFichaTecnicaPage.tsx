import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  ATUALIZAR_FICHA_TECNICA,
  FICHA_TECNICA,
  DETALHAR_FICHA_TECNICA,
  PRE_RECEBIMENTO,
} from "src/configs/constants";
import Atualizar from "src/components/screens/PreRecebimento/FichaTecnica/components/Atualizar";

const atual = {
  href: `/${PRE_RECEBIMENTO}/${ATUALIZAR_FICHA_TECNICA}`,
  titulo: "Atualizar Ficha Técnica",
};

const anteriores = [
  {
    href: `/`,
    titulo: "Pré-Recebimento",
  },
  {
    href: `/${PRE_RECEBIMENTO}/${FICHA_TECNICA}`,
    titulo: "Fichas Técnicas",
  },
  {
    href: `/${PRE_RECEBIMENTO}/${DETALHAR_FICHA_TECNICA}`,
    titulo: "Detalhar Ficha Técnica",
  },
];

export default () => (
  <Page
    botaoVoltar
    voltarPara={`/${PRE_RECEBIMENTO}/${FICHA_TECNICA}`}
    titulo={atual.titulo}
  >
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
    <Atualizar />
  </Page>
);
