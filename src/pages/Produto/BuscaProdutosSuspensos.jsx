import React from "react";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import BuscaProdutoSuspensos from "src/components/screens/Produto/BuscaProdutoSuspensos";
import Page from "src/components/Shareable/Page/Page";
import { SUSPENSAO_DE_PRODUTO, GESTAO_PRODUTO } from "src/configs/constants";

const atual = {
  href: `/${GESTAO_PRODUTO}/${SUSPENSAO_DE_PRODUTO}`,
  titulo: "Relatório de análise de produtos suspensos",
};

export default () => (
  <Page
    titulo={"Relatório de análise de produtos suspensos"}
    botaoVoltar
    voltarPara={"/"}
  >
    <Breadcrumb home={"/"} atual={atual} />
    <BuscaProdutoSuspensos />
  </Page>
);
