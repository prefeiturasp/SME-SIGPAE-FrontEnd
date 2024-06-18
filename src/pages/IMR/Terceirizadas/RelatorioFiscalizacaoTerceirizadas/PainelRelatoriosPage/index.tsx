import React from "react";
import { HOME } from "constants/config";
import Breadcrumb from "components/Shareable/Breadcrumb";
import Page from "components/Shareable/Page/Page";
import {
  SUPERVISAO,
  TERCEIRIZADAS,
  PAINEL_RELATORIOS_FISCALIZACAO,
} from "configs/constants";
import { PainelRelatorios } from "components/screens/IMR/Terceirizadas/RelatorioFiscalizacaoTerceirizadas/PainelRelatorios";

const atual = {
  href: `/${SUPERVISAO}/${TERCEIRIZADAS}/${PAINEL_RELATORIOS_FISCALIZACAO}`,
  titulo: "Painel de Acompanhamento dos Relatórios",
};

const anteriores = [
  {
    href: `/`,
    titulo: "Supervisão",
  },
  {
    href: `/`,
    titulo: "Terceirizadas",
  },
];

export const PainelRelatoriosPage = () => (
  <Page botaoVoltar titulo={atual.titulo}>
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
    <PainelRelatorios />
  </Page>
);
