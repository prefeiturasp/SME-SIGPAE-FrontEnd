import React from "react";
import Breadcrumb from "../../components/Shareable/Breadcrumb";
import Page from "../../components/Shareable/Page/Page";
import { NovaPermissaoLancamentoEspecial } from "src/components/screens/Cadastros/NovaPermissaoLancamentoEspecial";
import {
  CADASTROS,
  CONFIGURACOES,
  NOVA_PERMISSAO_LANCAMENTO_ESPECIAL,
  EDITAR_PERMISSAO_LANCAMENTO_ESPECIAL,
  TIPOS_ALIMENTACAO,
  PERMISSAO_LANCAMENTOS_ESPECIAIS,
} from "../../configs/constants";
import { useLocation } from "react-router-dom";

export default () => {
  const breadcrumbURL = () => {
    const location = useLocation();
    if (location.pathname.includes("editar")) {
      return EDITAR_PERMISSAO_LANCAMENTO_ESPECIAL;
    } else {
      return NOVA_PERMISSAO_LANCAMENTO_ESPECIAL;
    }
  };

  const breadcrumbTitle = () => {
    const location = useLocation();
    if (location.pathname.includes("editar")) {
      return "Editar Permissão de Lançamento Especial";
    } else {
      return "Nova Permissão de Lançamento Especial";
    }
  };

  const atual = {
    href: `/${CONFIGURACOES}/${CADASTROS}/${TIPOS_ALIMENTACAO}/${PERMISSAO_LANCAMENTOS_ESPECIAIS}/${breadcrumbURL()}`,
    titulo: breadcrumbTitle(),
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
    {
      href: `/${CONFIGURACOES}/${CADASTROS}/${TIPOS_ALIMENTACAO}/${PERMISSAO_LANCAMENTOS_ESPECIAIS}`,
      titulo: "Permissão de Lançamentos Especiais",
    },
  ];

  return (
    <Page titulo={atual.titulo} botaoVoltar>
      <Breadcrumb home={"/"} anteriores={anteriores} atual={atual} />
      <NovaPermissaoLancamentoEspecial />
    </Page>
  );
};
