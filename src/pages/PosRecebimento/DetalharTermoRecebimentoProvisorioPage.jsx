import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  DETALHAR_TERMO_RECEBIMENTO_PROVISORIO,
  POS_RECEBIMENTO,
  TERMO_RECEBIMENTO_PROVISORIO,
  TERMO_RECEBIMENTO_PROVISORIO_FORNECEDOR,
} from "src/configs/constants";
import { usuarioEhEmpresaFornecedor } from "src/helpers/utilities";
import DetalharTermoRecebimentoProvisorio from "src/components/screens/PosRecebimento/TermoRecebimentoProvisorio/components/Detalhar";

const atual = {
  href: `/${POS_RECEBIMENTO}/${DETALHAR_TERMO_RECEBIMENTO_PROVISORIO}`,
  titulo: "Detalhar Termo de Recebimento Provisório",
};

const rotaListagem = usuarioEhEmpresaFornecedor()
  ? `/${POS_RECEBIMENTO}/${TERMO_RECEBIMENTO_PROVISORIO_FORNECEDOR}`
  : `/${POS_RECEBIMENTO}/${TERMO_RECEBIMENTO_PROVISORIO}`;

const anteriores = [
  {
    href: `/`,
    titulo: "Pós-Recebimento",
  },
  {
    href: rotaListagem,
    titulo: "Termo de Recebimento Provisório",
  },
];

export default () => (
  <Page botaoVoltar titulo={atual.titulo}>
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
    <DetalharTermoRecebimentoProvisorio />
  </Page>
);
