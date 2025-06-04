import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  CADASTRO_LAYOUT_EMBALAGEM,
  LAYOUT_EMBALAGEM,
  PRE_RECEBIMENTO,
} from "src/configs/constants";
import CadastroLayoutEmbalagem from "src/components/screens/PreRecebimento/CadastroLayoutEmbalagem";

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
