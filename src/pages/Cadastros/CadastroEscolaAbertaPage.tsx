import React from "react";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import { CADASTROS, CONFIGURACOES, ESCOLA_ABERTA } from "src/configs/constants";
import { CadastrarEscolaAberta } from "../../components/screens/Cadastros/EscolaAberta/CadastrarEscolaAberta";

const atual = {
  href: `/${CONFIGURACOES}/${CADASTROS}/${ESCOLA_ABERTA}`,
  titulo: "Cadastrar Escola Aberta",
};

const anteriores = [
  {
    href: `/${CONFIGURACOES}/${CADASTROS}`,
    titulo: "Cadastros",
  },
];

export const CadastroEscolaAbertaPage = () => {
  return (
    <Page titulo={atual.titulo} botaoVoltar>
      <Breadcrumb home={"/"} anteriores={anteriores} atual={atual} />
      <CadastrarEscolaAberta />
    </Page>
  );
};
