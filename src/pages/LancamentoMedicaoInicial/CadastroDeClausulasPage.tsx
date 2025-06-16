import React from "react";
import Breadcrumb from "../../components/Shareable/Breadcrumb";
import Page from "../../components/Shareable/Page/Page";
import {
  CADASTRO_DE_CLAUSULA,
  CLAUSULAS_PARA_DESCONTOS,
  MEDICAO_INICIAL,
} from "../../configs/constants";
import { CadastroDeClausulas } from "src/components/screens/LancamentoInicial/CadastroDeClausulas";

const atual = {
  href: `/${MEDICAO_INICIAL}/${CLAUSULAS_PARA_DESCONTOS}/${CADASTRO_DE_CLAUSULA}`,
  titulo: "Cadastrar Cláusulas",
};

const anterior = [
  {
    href: "#",
    titulo: "Medição Inicial",
  },
  {
    href: "#",
    titulo: "Cadastros",
  },
  {
    href: `/${MEDICAO_INICIAL}/${CLAUSULAS_PARA_DESCONTOS}/`,
    titulo: "Cláusulas para Descontos",
  },
];

export const CadastroDeClausulasPage = () => (
  <Page titulo={atual.titulo} botaoVoltar>
    <Breadcrumb home={"/"} anteriores={anterior} atual={atual} />
    <CadastroDeClausulas />
  </Page>
);
