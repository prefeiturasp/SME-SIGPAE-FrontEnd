import React from "react";
import Breadcrumb from "../../../components/Shareable/Breadcrumb";
import Page from "../../../components/Shareable/Page/Page";
import Relatorio from "../../../components/InversaoDeDiaDeCardapio/DRE/Relatorio";
import { HOME } from "../constants";
import { DRE, INVERSAO_CARDAPIO } from "../../../configs/constants";

const atual = {
  href: "#",
  titulo: "Relatório",
};

const anteriores = [
  {
    href: `/${DRE}/${INVERSAO_CARDAPIO}`,
    titulo: "Inversões de dia de Cardápio",
  },
];

export default () => (
  <Page>
    <Breadcrumb home={HOME} anteriores={anteriores} atual={atual} />
    <Relatorio />
  </Page>
);
