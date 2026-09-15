import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  DETALHAR_TERMO_RECEBIMENTO_DEFINITIVO,
  POS_RECEBIMENTO,
  TERMO_RECEBIMENTO_DEFINITIVO,
  TERMO_RECEBIMENTO_DEFINITIVO_FORNECEDOR,
} from "src/configs/constants";
import { usuarioEhEmpresaFornecedor } from "src/helpers/utilities";
import DetalharTermoRecebimentoDefinitivo from "src/components/screens/PosRecebimento/TermoRecebimentoDefinitivo/components/Detalhar";

const atual = {
  href: `/${POS_RECEBIMENTO}/${DETALHAR_TERMO_RECEBIMENTO_DEFINITIVO}`,
  titulo: "Detalhar Termo de Recebimento Definitivo",
};

const rotaListagem = usuarioEhEmpresaFornecedor()
  ? `/${POS_RECEBIMENTO}/${TERMO_RECEBIMENTO_DEFINITIVO_FORNECEDOR}`
  : `/${POS_RECEBIMENTO}/${TERMO_RECEBIMENTO_DEFINITIVO}`;

const anteriores = [
  {
    href: `/`,
    titulo: "Pós-Recebimento",
  },
  {
    href: rotaListagem,
    titulo: "Termo de Recebimento Definitivo",
  },
];

export default () => (
  <Page botaoVoltar voltarPara={rotaListagem} titulo={atual.titulo}>
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
    <DetalharTermoRecebimentoDefinitivo />
  </Page>
);
