import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  PAINEL_LAYOUT_EMBALAGEM,
  PRE_RECEBIMENTO,
} from "src/configs/constants";
import PainelLayoutEmbalagem from "../../components/screens/PreRecebimento/PainelLayoutEmbalagem";

const atual = {
  href: `/${PRE_RECEBIMENTO}/${PAINEL_LAYOUT_EMBALAGEM}`,
  titulo: "Layout de Embalagens",
};

const anteriores = [
  {
    href: `/`,
    titulo: "Pré-Recebimento",
  },
];

export const PainelLayoutEmbalagemPage = () => (
  <Page botaoVoltar voltarPara="/" titulo={atual.titulo}>
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
    <PainelLayoutEmbalagem />
  </Page>
);
