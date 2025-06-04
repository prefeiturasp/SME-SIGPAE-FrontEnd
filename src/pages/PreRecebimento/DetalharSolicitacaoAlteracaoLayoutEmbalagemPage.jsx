import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  LAYOUT_EMBALAGEM,
  PAINEL_LAYOUT_EMBALAGEM,
  PRE_RECEBIMENTO,
  DETALHAR_LAYOUT_EMBALAGEM_SOLICITACAO_ALTERACAO,
} from "src/configs/constants";
import Detalhar from "../../components/screens/PreRecebimento/LayoutEmbalagem/components/Detalhar";

const atual = {
  href: `/${PRE_RECEBIMENTO}/${LAYOUT_EMBALAGEM}/${DETALHAR_LAYOUT_EMBALAGEM_SOLICITACAO_ALTERACAO}`,
  titulo: "Detalhar Solicitação de Alteração",
};

const anteriores = [
  {
    href: `/`,
    titulo: "Pré-Recebimento",
  },
  {
    href: `/${PRE_RECEBIMENTO}/${PAINEL_LAYOUT_EMBALAGEM}`,
    titulo: "Layout de Embalagem",
  },
];

const voltarPara = `/${PRE_RECEBIMENTO}/${PAINEL_LAYOUT_EMBALAGEM}`;

export default () => (
  <Page botaoVoltar voltarPara={voltarPara} titulo={atual.titulo}>
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
    <Detalhar />
  </Page>
);
