import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import { LAYOUT_EMBALAGEM, PRE_RECEBIMENTO } from "src/configs/constants";
import LayoutEmbalagem from "src/components/screens/PreRecebimento/LayoutEmbalagem";

const atual = {
  href: `/${PRE_RECEBIMENTO}/${LAYOUT_EMBALAGEM}`,
  titulo: "Layout de Embalagem",
};

const anteriores = [
  {
    href: `/`,
    titulo: "Pré-Recebimento",
  },
];

export default () => (
  <Page botaoVoltar voltarPara="/" titulo={atual.titulo}>
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
    <LayoutEmbalagem />
  </Page>
);
