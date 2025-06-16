import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import { PRE_RECEBIMENTO, PAINEL_FICHAS_TECNICAS } from "src/configs/constants";
import PainelFichasTecnicas from "src/components/screens/PreRecebimento/PainelFichasTecnicas";

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
