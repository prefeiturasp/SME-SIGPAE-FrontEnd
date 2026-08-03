import React from "react";
import Breadcrumb from "../../components/Shareable/Breadcrumb";
import RelatorioProduto from "../../components/screens/Produto/BuscaAvancada/components/RelatorioProduto";
import Page from "../../components/Shareable/Page/Page";
import {
  PESQUISA_DESENVOLVIMENTO,
  RELATORIO_PRODUTO,
} from "../../configs/constants";
import { ENVIRONMENT } from "src/constants/config";

const atual = {
  href: `/${PESQUISA_DESENVOLVIMENTO}/${RELATORIO_PRODUTO}`,
  titulo: "Consultar Produto",
};

export default () => (
  <Page
    titulo={
      !ENVIRONMENT.includes("production")
        ? "Visualizar Produto"
        : "Consultar Produto"
    }
    botaoVoltar
  >
    <Breadcrumb home={"/"} atual={atual} />
    <div className="mt-3">
      <RelatorioProduto />
    </div>
  </Page>
);
