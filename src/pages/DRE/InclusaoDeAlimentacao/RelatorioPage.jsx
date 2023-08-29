import React from "react";
import Breadcrumb from "../../../components/Shareable/Breadcrumb";
import Page from "../../../components/Shareable/Page/Page";
import Relatorio from "../../../components/InclusaoDeAlimentacao/DRE/Relatorio";
import { HOME } from "../constants";
import { DRE, INCLUSAO_ALIMENTACAO } from "../../../configs/constants";

const atual = {
  href: "#",
  titulo: "Relatório",
};

const anteriores = [
  {
    href: `/${DRE}/${INCLUSAO_ALIMENTACAO}`,
    titulo: "Inclusões de Alimentação",
  },
];

export default () => (
  <Page>
    <Breadcrumb home={HOME} anteriores={anteriores} atual={atual} />
    <Relatorio />
  </Page>
);
