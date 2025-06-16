import React from "react";
import Breadcrumb from "../../components/Shareable/Breadcrumb";
import TiposEmbalagens from "src/components/screens/Cadastros/TiposEmbalagens";
import Page from "../../components/Shareable/Page/Page";
import {
  CADASTROS,
  CONFIGURACOES,
  TIPOS_EMBALAGENS,
} from "../../configs/constants";

const atual = {
  href: `/${CONFIGURACOES}/${CADASTROS}/${TIPOS_EMBALAGENS}`,
  titulo: "Tipos de Embalagens",
};

const anteriores = [
  {
    href: `/${CONFIGURACOES}/${CADASTROS}`,
    titulo: "Cadastros",
  },
];

export default () => (
  <Page titulo={atual.titulo} botaoVoltar voltarPara={"/"}>
    <Breadcrumb home={"/"} anteriores={anteriores} atual={atual} />
    <TiposEmbalagens />
  </Page>
);
