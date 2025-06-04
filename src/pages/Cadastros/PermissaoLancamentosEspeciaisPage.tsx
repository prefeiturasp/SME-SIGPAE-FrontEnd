import React from "react";
import Breadcrumb from "../../components/Shareable/Breadcrumb";
import Page from "../../components/Shareable/Page/Page";
import { PermissaoLancamentosEspeciais } from "src/components/screens/Cadastros/PermissaoLancamentosEspeciais";
import {
  CADASTROS,
  CONFIGURACOES,
  TIPOS_ALIMENTACAO,
  PERMISSAO_LANCAMENTOS_ESPECIAIS,
} from "../../configs/constants";

const atual = {
  href: `/${CONFIGURACOES}/${CADASTROS}/${TIPOS_ALIMENTACAO}/${PERMISSAO_LANCAMENTOS_ESPECIAIS}`,
  titulo: "Permissão de Lançamentos Especiais",
};

const anteriores = [
  {
    href: `/${CONFIGURACOES}/${CADASTROS}`,
    titulo: "Cadastros",
  },
  {
    href: `/${CONFIGURACOES}/${CADASTROS}/${TIPOS_ALIMENTACAO}`,
    titulo: "Cadastro de tipo de alimentação",
  },
];

export default () => (
  <Page titulo={atual.titulo} botaoVoltar>
    <Breadcrumb home={"/"} anteriores={anteriores} atual={atual} />
    <PermissaoLancamentosEspeciais />
  </Page>
);
