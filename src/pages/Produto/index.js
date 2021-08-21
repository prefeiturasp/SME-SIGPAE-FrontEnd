import React from "react";
import Breadcrumb from "components/Shareable/Breadcrumb";
import ReclamacaoProduto from "components/screens/Produto/Reclamacao";
import AtivacaoSuspensaoDetalheProduto from "components/screens/Produto/AtivacaoSuspensao/AtivacaoSuspensaoDetalheProduto";
import AtivacaoSuspensao from "components/screens/Produto/AtivacaoSuspensao";
import ResponderReclamacaoDetalheProduto from "components/screens/Produto/ResponderReclamacao/ResponderReclamacaoDetalheProduto";
import ResponderQuestionamentoUE from "components/screens/Produto/ResponderQuestionamentoUE";
import ResponderQuestionamentoNutrisupervisor from "components/screens/Produto/ResponderQuestionamentoNutrisupervisor";
import ResponderReclamacao from "components/screens/Produto/ResponderReclamacao";
import RelatorioQuantitativoPorTerceirizada from "components/screens/Produto/RelatorioQuantitativoPorTerceirizada";

import Page from "components/Shareable/Page/Page";
import {
  PESQUISA_DESENVOLVIMENTO,
  RECLAMACAO_DE_PRODUTO,
  ATIVACAO_DE_PRODUTO,
  GESTAO_PRODUTO
} from "configs/constants";

export const ReclamacaoDeProdutoPage = () => {
  const atual = {
    href: `/${PESQUISA_DESENVOLVIMENTO}/${RECLAMACAO_DE_PRODUTO}`,
    titulo: "Reclamação de Produto"
  };

  return (
    <Page titulo={atual.titulo} botaoVoltar voltarPara="/">
      <Breadcrumb home={"/"} atual={atual} />
      <ReclamacaoProduto />
    </Page>
  );
};

export const ConsultaAtivacaoDeProdutoPage = () => {
  const atual = {
    href: `/${GESTAO_PRODUTO}/${ATIVACAO_DE_PRODUTO}/consulta`,
    titulo: "Ativar/suspender Produto"
  };

  return (
    <Page titulo={atual.titulo} botaoVoltar voltarPara="/">
      <Breadcrumb home={"/"} atual={atual} />
      <AtivacaoSuspensao />
    </Page>
  );
};

export const AtivacaoDeProdutoPage = () => {
  const atual = {
    href: `/${GESTAO_PRODUTO}/${ATIVACAO_DE_PRODUTO}/detalhe`,
    titulo: "Ativar/suspender Produto"
  };

  return (
    <Page titulo={atual.titulo}>
      <Breadcrumb home={"/"} atual={atual} />
      <AtivacaoSuspensaoDetalheProduto />
    </Page>
  );
};

export const ConsultaResponderReclamacaoPage = () => {
  const atual = {
    href: `/${GESTAO_PRODUTO}/responder-reclamacao/consulta`,
    titulo: "Responder reclamação de produto"
  };

  return (
    <Page titulo={atual.titulo} botaoVoltar voltarPara={"/"}>
      <Breadcrumb home={"/"} atual={atual} />
      <ResponderReclamacao />
    </Page>
  );
};

export const ResponderReclamacaoPage = () => {
  const atual = {
    href: `/${GESTAO_PRODUTO}/responder-reclamacao/detalhe`,
    titulo: "Responder reclamação de produto"
  };

  return (
    <Page titulo={atual.titulo}>
      <Breadcrumb home={"/"} atual={atual} />
      <ResponderReclamacaoDetalheProduto />
    </Page>
  );
};

export const ResponderQuestionamentoUEPage = () => {
  const atual = {
    href: `/${GESTAO_PRODUTO}/responder-questionamento-ue`,
    titulo: "Responder Questionamento"
  };

  return (
    <Page botaoVoltar voltarPara="/" titulo={atual.titulo}>
      <Breadcrumb home={"/"} atual={atual} />
      <ResponderQuestionamentoUE />
    </Page>
  );
};

export const ResponderQuestionamentoNutrisupervisorPage = () => {
  const atual = {
    href: `/${GESTAO_PRODUTO}/responder-questionamento-nutrisupervisor`,
    titulo: "Responder Questionamento"
  };

  return (
    <Page botaoVoltar voltarPara="/" titulo={atual.titulo}>
      <Breadcrumb home={"/"} atual={atual} />
      <ResponderQuestionamentoNutrisupervisor />
    </Page>
  );
};

export const RelatorioQuantitativoPorTerceirizadaPage = () => {
  const atual = {
    href: `/${GESTAO_PRODUTO}/relatorios/quantitativo-por-terceirizada`,
    titulo: "Relatório quantitativo de produtos por terceirizadas"
  };

  return (
    <Page
      botaoVoltar
      voltarPara="/"
      titulo="Relatório quantitativo de produtos por terceirizadas"
    >
      <Breadcrumb home={"/"} atual={atual} />
      <RelatorioQuantitativoPorTerceirizada />
    </Page>
  );
};
