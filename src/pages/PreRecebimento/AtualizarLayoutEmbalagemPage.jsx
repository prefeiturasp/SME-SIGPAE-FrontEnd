import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  ATUALIZAR_LAYOUT_EMBALAGEM,
  LAYOUT_EMBALAGEM,
  PRE_RECEBIMENTO,
} from "src/configs/constants";
import Corrigir from "../../components/screens/PreRecebimento/LayoutEmbalagem/components/Corrigir";

const atual = {
  href: `/${PRE_RECEBIMENTO}/${ATUALIZAR_LAYOUT_EMBALAGEM}`,
  titulo: "Atualizar Layout de Embalagem",
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

export default () => (
  <Page
    botaoVoltar
    voltarPara={`/${PRE_RECEBIMENTO}/${LAYOUT_EMBALAGEM}`}
    titulo={atual.titulo}
  >
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
    <Corrigir atualizar />
  </Page>
);
