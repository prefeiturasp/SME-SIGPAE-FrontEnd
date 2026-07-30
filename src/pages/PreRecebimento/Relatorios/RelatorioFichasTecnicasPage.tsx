import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  RELATORIO_FICHAS_TECNICAS,
  PRE_RECEBIMENTO,
} from "src/configs/constants";
import RelatorioFichasTecnicas from "src/components/screens/PreRecebimento/Relatorios/RelatorioFichasTecnicas";

const atual = {
  href: `/${PRE_RECEBIMENTO}/${RELATORIO_FICHAS_TECNICAS}`,
  titulo: "Relatório de Fichas Técnicas",
};

const anteriores = [
  {
    href: `/`,
    titulo: "Pré-Recebimento",
  },
  {
    href: `/`,
    titulo: "Relatórios",
  },
];

export default () => (
  <Page botaoVoltar voltarPara="/" titulo={atual.titulo}>
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
    <RelatorioFichasTecnicas />
  </Page>
);
