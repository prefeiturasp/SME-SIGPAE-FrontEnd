import React from "react";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import RelatorioReclamacaoProduto from "src/components/screens/Produto/RelatorioReclamacaoProduto";
import Page from "src/components/Shareable/Page/Page";
import {
  GESTAO_PRODUTO,
  RELATORIO_RECLAMACAO_PRODUTO,
} from "../../configs/constants";

const atual = {
  href: `/${GESTAO_PRODUTO}/${RELATORIO_RECLAMACAO_PRODUTO}`,
  titulo: "Relatório de acompanhamento de reclamação de produto",
};

export default () => (
  <Page
    titulo={"Relatório de acompanhamento de reclamação de produto"}
    botaoVoltar
    voltarPara={"/"}
  >
    <Breadcrumb home={"/"} atual={atual} />
    <RelatorioReclamacaoProduto />
  </Page>
);
