import React from "react";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import { EditaisContratosRefatorado } from "src/components/screens/Cadastros/EditaisContratosRefatorado/Cadastro";
import Page from "src/components/Shareable/Page/Page";
import {
  CONFIGURACOES,
  CADASTROS,
  EDITAIS_CADASTRADOS,
} from "src/configs/constants";

const atual = {
  href: `/${CONFIGURACOES}/${CADASTROS}/${EDITAIS_CADASTRADOS}`,
  titulo: "Editais e Contratos",
};

const anteriores = [
  {
    href: `/${CONFIGURACOES}/${CADASTROS}`,
    titulo: "Cadastros",
  },
];

export default () => (
  <Page
    titulo={atual.titulo}
    botaoVoltar
    voltarPara={`/${CONFIGURACOES}/${CADASTROS}`}
  >
    <Breadcrumb home={"/"} anteriores={anteriores} atual={atual} />
    <EditaisContratosRefatorado />
  </Page>
);
