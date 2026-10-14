import React from "react";
import { HOME } from "src/constants/config";
import {
  MEDICAO_INICIAL,
  RELATORIOS,
  RELATORIO_ALIMENTACOES_SERVIDAS,
} from "src/configs/constants";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import RelatorioAlimentacoesServidas from "src/components/screens/LancamentoInicial/Relatorios/RelatorioAlimentacoesServidas";

const anteriores = [
  {
    href: "#",
    titulo: "Medição Inicial",
  },
  {
    href: "#",
    titulo: "Relatórios",
  },
];

const atual = {
  href: `/${MEDICAO_INICIAL}/${RELATORIOS}/${RELATORIO_ALIMENTACOES_SERVIDAS}`,
  titulo: "Relatório de Alimentações Servidas",
};

export const RelatorioAlimentacoesServidasPage = () => (
  <Page botaoVoltar titulo={"Relatório de Alimentações Servidas"}>
    <Breadcrumb home={HOME} anteriores={anteriores} atual={atual} />
    <RelatorioAlimentacoesServidas />
  </Page>
);
