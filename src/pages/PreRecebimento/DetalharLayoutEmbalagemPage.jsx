import React from "react";
import { HOME } from "constants/config";
import Breadcrumb from "components/Shareable/Breadcrumb";
import Page from "components/Shareable/Page/Page";
import {
  LAYOUT_EMBALAGEM,
  PAINEL_LAYOUT_EMBALAGEM,
  PRE_RECEBIMENTO,
  DETALHAR_LAYOUT_EMBALAGEM,
} from "configs/constants";
import Detalhar from "../../components/screens/PreRecebimento/LayoutEmbalagem/components/Detalhar";
import { usuarioComAcessoAoPainelEmbalagens } from "../../helpers/utilities";

const atual = {
  href: `/${PRE_RECEBIMENTO}/${LAYOUT_EMBALAGEM}/${DETALHAR_LAYOUT_EMBALAGEM}`,
  titulo: "Detalhar Layout de Embalagem",
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

const voltarPara = usuarioComAcessoAoPainelEmbalagens()
  ? `/${PRE_RECEBIMENTO}/${PAINEL_LAYOUT_EMBALAGEM}`
  : `/${PRE_RECEBIMENTO}/${LAYOUT_EMBALAGEM}`;

export default () => (
  <Page botaoVoltar voltarPara={voltarPara} titulo={atual.titulo}>
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
    <Detalhar />
  </Page>
);
