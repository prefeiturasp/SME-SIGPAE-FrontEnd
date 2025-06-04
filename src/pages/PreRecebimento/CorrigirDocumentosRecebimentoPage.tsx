import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  DOCUMENTOS_RECEBIMENTO,
  PRE_RECEBIMENTO,
  CORRIGIR_DOCUMENTOS_RECEBIMENTO,
} from "src/configs/constants";
import Corrigir from "src/components/screens/PreRecebimento/DocumentosRecebimento/components/Corrigir";

const atual = {
  href: `/${PRE_RECEBIMENTO}/${DOCUMENTOS_RECEBIMENTO}/${CORRIGIR_DOCUMENTOS_RECEBIMENTO}`,
  titulo: "Correção de Documentos de Recebimento",
};

const anteriores = [
  {
    href: `/`,
    titulo: "Pré-Recebimento",
  },
  {
    href: `/${PRE_RECEBIMENTO}/${DOCUMENTOS_RECEBIMENTO}`,
    titulo: "Documentos de Recebimento",
  },
];

const voltarPara = `/${PRE_RECEBIMENTO}/${DOCUMENTOS_RECEBIMENTO}`;

export default () => (
  <Page botaoVoltar voltarPara={voltarPara} titulo={atual.titulo}>
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
    <Corrigir />
  </Page>
);
