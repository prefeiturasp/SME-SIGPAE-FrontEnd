import React from "react";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import ReclamacaoProduto from "src/components/screens/Produto/Reclamacao";
import AtivacaoSuspensaoDetalheProduto from "src/components/screens/Produto/AtivacaoSuspensao/AtivacaoSuspensaoDetalheProduto";
import AtivacaoSuspensao from "src/components/screens/Produto/AtivacaoSuspensao";
import ResponderReclamacaoDetalheProduto from "src/components/screens/Produto/ResponderReclamacao/ResponderReclamacaoDetalheProduto";
import ResponderQuestionamentoUE from "src/components/screens/Produto/ResponderQuestionamentoUE";
import ResponderQuestionamentoNutrisupervisor from "src/components/screens/Produto/ResponderQuestionamentoNutrisupervisor";
import ResponderReclamacao from "src/components/screens/Produto/ResponderReclamacao";
import RelatorioQuantitativoPorTerceirizada from "src/components/screens/Produto/RelatorioQuantitativoPorTerceirizada";

import Page from "src/components/Shareable/Page/Page";
import {
  PESQUISA_DESENVOLVIMENTO,
  RECLAMACAO_DE_PRODUTO,
  ATIVACAO_DE_PRODUTO,
  GESTAO_PRODUTO,
} from "src/configs/constants";

export const ReclamacaoDeProdutoPage = () => {
  const atual = {
    href: `/${PESQUISA_DESENVOLVIMENTO}/${RECLAMACAO_DE_PRODUTO}`,
    titulo: "Reclamação de Produto",
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
    titulo: "Ativar/suspender Produto",
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
    titulo: "Ativar/suspender Produto",
  };

  return (
    <Page titulo={atual.titulo}>
      <Breadcrumb home={"/"} atual={atual} />
      <AtivacaoSuspensaoDetalheProduto />
    </Page>
  );
};

export const ConsultaResponderReclamacaoPage = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const uuid = urlParams.get("uuid");

  const atual = {
    href: `/${GESTAO_PRODUTO}/responder-reclamacao/consulta`,
    titulo: uuid
      ? "Aguardando análise das Reclamações"
      : "Responder Questionamento da CODAE",
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
    titulo: "Responder Questionamento da CODAE",
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
    titulo: "Responder Questionamento da CODAE",
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
    titulo: "Responder Questionamento da CODAE",
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
    titulo: "Relatório quantitativo de produtos por terceirizadas",
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
