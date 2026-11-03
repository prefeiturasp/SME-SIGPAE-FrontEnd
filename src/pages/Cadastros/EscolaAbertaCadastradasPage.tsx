import React from "react";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  CADASTROS,
  CONFIGURACOES,
  ESCOLA_ABERTA,
  ESCOLA_ABERTA_CADASTRADAS,
} from "src/configs/constants";
import { EscolaAbertaCadastradas } from "../../components/screens/Cadastros/EscolaAberta/EscolaAbertaCadastradas";
import { ENVIRONMENT } from "../../constants/config";

const atual = {
  href: `/${CONFIGURACOES}/${CADASTROS}/${ESCOLA_ABERTA_CADASTRADAS}`,
  titulo: "Escola Aberta Cadastradas",
};

const anteriores = [
  {
    href: `/${CONFIGURACOES}/${CADASTROS}`,
    titulo: "Cadastros",
  },
  {
    href: `/${CONFIGURACOES}/${CADASTROS}/${ESCOLA_ABERTA}`,
    titulo: "Cadastrar Escola Aberta",
  },
];

export const EscolaAbertaCadastradasPage = () => {
  return (
    <Page titulo={atual.titulo} botaoVoltar>
      <Breadcrumb home={"/"} anteriores={anteriores} atual={atual} />
      {!ENVIRONMENT.includes("production") && <EscolaAbertaCadastradas />}
    </Page>
  );
};
