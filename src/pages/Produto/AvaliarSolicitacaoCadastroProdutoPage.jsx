import React from "react";
import Breadcrumb from "../../components/Shareable/Breadcrumb";
import Page from "../../components/Shareable/Page/Page";
import {
  AVALIAR_SOLICITACAO_CADASTRO_PRODUTO,
  GESTAO_PRODUTO,
} from "../../configs/constants";
import AvaliarSolicitacaoCadastroProduto from "src/components/screens/Produto/AvaliarSolicitacaoCadastroProduto";

const atual = {
  href: `/${GESTAO_PRODUTO}/${AVALIAR_SOLICITACAO_CADASTRO_PRODUTO}`,
  titulo: "Confirmação das Solicitações de Novos Produtos",
};

export default () => {
  return (
    <Page
      titulo={"Confirmação das Solicitações de Novos Produtos"}
      botaoVoltar
      voltarPara={"/"}
    >
      <Breadcrumb home={"/"} atual={atual} />
      <AvaliarSolicitacaoCadastroProduto />
    </Page>
  );
};
