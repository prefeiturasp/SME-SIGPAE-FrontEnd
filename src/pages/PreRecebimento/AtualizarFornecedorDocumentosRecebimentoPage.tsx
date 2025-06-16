import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  ATUALIZAR_FORNECEDOR_DOCUMENTO_RECEBIMENTO,
  PAINEL_DOCUMENTOS_RECEBIMENTO,
  DOCUMENTOS_RECEBIMENTO,
  PRE_RECEBIMENTO,
} from "src/configs/constants";
import AtualizarDocumentos from "src/components/screens/PreRecebimento/DocumentosRecebimento/components/AtualizarDocumentos";
import { usuarioEhEmpresaFornecedor } from "src/helpers/utilities";

const atual = {
  href: `/${PRE_RECEBIMENTO}/${ATUALIZAR_FORNECEDOR_DOCUMENTO_RECEBIMENTO}`,
  titulo: "Atualizar Documento de Recebimento",
};

const link = usuarioEhEmpresaFornecedor()
  ? `/${PRE_RECEBIMENTO}/${DOCUMENTOS_RECEBIMENTO}`
  : `/${PRE_RECEBIMENTO}/${PAINEL_DOCUMENTOS_RECEBIMENTO}`;

const anteriores = [
  {
    href: `/`,
    titulo: "Pré-Recebimento",
  },
  {
    href: link,
    titulo: "Documentos de Recebimento",
  },
];

export default () => (
  <Page botaoVoltar voltarPara={link} titulo={atual.titulo}>
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
    <AtualizarDocumentos />
  </Page>
);
