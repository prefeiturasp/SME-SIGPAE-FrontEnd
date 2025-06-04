import React from "react";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import { EditaisContratosRefatorado } from "src/components/screens/Cadastros/EditaisContratosRefatorado/Cadastro";
import Page from "src/components/Shareable/Page/Page";
import {
  CONFIGURACOES,
  CADASTROS,
  EDITAIS_CADASTRADOS,
  EDITAIS_CONTRATOS,
  EDITAR,
} from "src/configs/constants";

const atual = {
  href: `/${CONFIGURACOES}/${CADASTROS}/${EDITAIS_CADASTRADOS}/${EDITAR}`,
  titulo: "Editais e Contratos - Edição",
};

const anteriores = [
  {
    href: `/${CONFIGURACOES}/${CADASTROS}`,
    titulo: "Cadastros",
  },
  {
    href: `/${CONFIGURACOES}/${CADASTROS}/${EDITAIS_CONTRATOS}`,
    titulo: "Editais e Contratos",
  },
  {
    href: `/${CONFIGURACOES}/${CADASTROS}/${EDITAIS_CADASTRADOS}`,
    titulo: "Editais e Contratos Cadastrados",
  },
];

export default () => (
  <Page titulo={atual.titulo} botaoVoltar>
    <Breadcrumb home={"/"} anteriores={anteriores} atual={atual} />
    <EditaisContratosRefatorado />
  </Page>
);
