import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  CADASTRAR_FICHA_TECNICA,
  FICHA_TECNICA,
  PRE_RECEBIMENTO,
} from "src/configs/constants";
import Cadastrar from "src/components/screens/PreRecebimento/FichaTecnica/components/Cadastrar";

const atual = {
  href: `/${PRE_RECEBIMENTO}/${CADASTRAR_FICHA_TECNICA}`,
  titulo: "Cadastrar Ficha Técnica",
};

const anteriores = [
  {
    href: `/`,
    titulo: "Pré-Recebimento",
  },
  {
    href: `/${PRE_RECEBIMENTO}/${FICHA_TECNICA}`,
    titulo: "Ficha Técnica do Produto",
  },
];

export default () => (
  <Page
    botaoVoltar
    temModalVoltar
    textoModalVoltar="Existem informações não salvas na Ficha Técnica. Ao voltar à tela anterior, as informações inseridas serão perdidas."
    voltarPara={`/${PRE_RECEBIMENTO}/${FICHA_TECNICA}`}
    titulo={atual.titulo}
  >
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />

    <Cadastrar />
  </Page>
);
