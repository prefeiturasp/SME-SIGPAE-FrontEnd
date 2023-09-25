import React from "react";
import { HOME } from "constants/config";
import Breadcrumb from "components/Shareable/Breadcrumb";
import Page from "components/Shareable/Page/Page";
import {
  CADASTRO_LAYOUT_EMBALAGEM,
  LAYOUT_EMBALAGEM,
  PRE_RECEBIMENTO,
} from "configs/constants";
import CadastroLayoutEmbalagem from "components/screens/PreRecebimento/CadastroLayoutEmbalagem";

const atual = {
  href: `/${PRE_RECEBIMENTO}/${CADASTRO_LAYOUT_EMBALAGEM}`,
  titulo: "Cadastrar Layout de Embalagem",
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
    <CadastroLayoutEmbalagem />
  </Page>
);
