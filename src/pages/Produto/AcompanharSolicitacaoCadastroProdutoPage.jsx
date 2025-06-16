import React from "react";
import Breadcrumb from "../../components/Shareable/Breadcrumb";
import Page from "../../components/Shareable/Page/Page";
import {
  ACOMPANHAR_SOLICITACAO_CADASTRO_PRODUTO,
  GESTAO_PRODUTO,
} from "../../configs/constants";
import AvaliarSolicitacaoCadastroProduto from "src/components/screens/Produto/AvaliarSolicitacaoCadastroProduto";

const atual = {
  href: `/${GESTAO_PRODUTO}/${ACOMPANHAR_SOLICITACAO_CADASTRO_PRODUTO}`,
  titulo: "Acompanhar Solicitações de Novos Produtos",
};

export default () => {
  return (
    <Page
      titulo={"Acompanhar Solicitações de Novos Produtos"}
      botaoVoltar
      voltarPara={"/"}
    >
      <Breadcrumb home={"/"} atual={atual} />
      <AvaliarSolicitacaoCadastroProduto />
    </Page>
  );
};
