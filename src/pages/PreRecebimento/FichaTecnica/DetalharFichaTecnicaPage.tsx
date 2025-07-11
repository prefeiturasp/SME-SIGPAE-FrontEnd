import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  ANALISAR_FICHA_TECNICA,
  PAINEL_FICHAS_TECNICAS,
  PRE_RECEBIMENTO,
  FICHA_TECNICA,
} from "src/configs/constants";
import Analisar from "src/components/screens/PreRecebimento/FichaTecnica/components/Analisar";
import { usuarioEhEmpresaFornecedor } from "src/helpers/utilities";

const atual = {
  href: `/${PRE_RECEBIMENTO}/${ANALISAR_FICHA_TECNICA}`,
  titulo: "Detalhar Ficha Técnica",
};

const link = usuarioEhEmpresaFornecedor()
  ? `/${PRE_RECEBIMENTO}/${FICHA_TECNICA}`
  : `/${PRE_RECEBIMENTO}/${PAINEL_FICHAS_TECNICAS}`;

const anteriores = [
  {
    href: `/`,
    titulo: "Pré-Recebimento",
  },
  {
    href: link,
    titulo: "Fichas Técnicas",
  },
];

export default () => (
  <Page botaoVoltar voltarPara={link} titulo={atual.titulo}>
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
    <Analisar somenteLeitura />
  </Page>
);
