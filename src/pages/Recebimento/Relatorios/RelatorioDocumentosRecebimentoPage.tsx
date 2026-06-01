import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  RECEBIMENTO,
  RELATORIO_DOCUMENTOS_RECEBIMENTO,
} from "src/configs/constants";
import RelatorioDocumentosRecebimento from "src/components/screens/Recebimento/Relatorios/RelatorioDocumentosRecebimento";

const atual = {
  href: `/${RECEBIMENTO}/${RELATORIO_DOCUMENTOS_RECEBIMENTO}`,
  titulo: "Relatório de Documentos de Recebimento",
};

const anteriores = [
  {
    href: `/`,
    titulo: "Recebimento",
  },
  {
    href: `/`,
    titulo: "Relatórios",
  },
];

export default () => (
  <Page botaoVoltar voltarPara="/" titulo={atual.titulo}>
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
    <RelatorioDocumentosRecebimento />
  </Page>
);
