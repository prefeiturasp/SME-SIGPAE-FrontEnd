import React from "react";
import { HOME } from "constants/config";
import Breadcrumb from "components/Shareable/Breadcrumb";
import Page from "components/Shareable/Page/Page";
import {
  LAYOUT_EMBALAGEM,
  PRE_RECEBIMENTO,
  ANALISAR_LAYOUT_EMBALAGEM,
} from "configs/constants";
import Detalhar from "../../components/screens/PreRecebimento/LayoutEmbalagem/components/Detalhar";

const atual = {
  href: `/${PRE_RECEBIMENTO}/${LAYOUT_EMBALAGEM}/${ANALISAR_LAYOUT_EMBALAGEM}`,
  titulo: "Analisar Layout de Embalagem",
};

const anteriores = [
  {
    href: `/`,
    titulo: "Pré-Recebimento",
  },
  {
    href: `/${PRE_RECEBIMENTO}/${LAYOUT_EMBALAGEM}`,
    titulo: "Layout de Embalagem",
  },
];

const voltarPara = `/${PRE_RECEBIMENTO}/${LAYOUT_EMBALAGEM}`;

export default () => (
  <Page botaoVoltar voltarPara={voltarPara} titulo={atual.titulo}>
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
    <Detalhar analise />
  </Page>
);
