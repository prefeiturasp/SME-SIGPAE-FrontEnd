import React from "react";
import { HOME } from "constants/config";
import Breadcrumb from "components/Shareable/Breadcrumb";
import Page from "components/Shareable/Page/Page";
import { PRE_RECEBIMENTO, PAINEL_FICHAS_TECNICAS } from "configs/constants";
import PainelFichasTecnicas from "components/screens/PreRecebimento/PainelFichasTecnicas";

const atual = {
  href: `/${PRE_RECEBIMENTO}/${PAINEL_FICHAS_TECNICAS}`,
  titulo: "Fichas Técnicas",
};

const anteriores = [
  {
    href: `/`,
    titulo: "Pré-Recebimento",
  },
];

export const PainelFichasTecnicasPage = () => (
  <Page botaoVoltar voltarPara="/" titulo={atual.titulo}>
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
    <PainelFichasTecnicas />
  </Page>
);
