import React from "react";

import { HOME } from "../../constants/config";
import Breadcrumb from "../../components/Shareable/Breadcrumb";
import Page from "../../components/Shareable/Page/Page";
import RelatorioProdutosHomologados from "src/components/screens/RelatorioProdutosHomologados";

const atual = {
  href: "/relatorios/produtos-homologados",
  titulo: "Relatório de Produto",
};

const RelatorioProdutosHomologadosPage = () => {
  return (
    <Page
      titulo={"Relatório de Produtos Homologados"}
      botaoVoltar
      voltarPara={"/"}
    >
      <Breadcrumb home={HOME} atual={atual} />
      <RelatorioProdutosHomologados />
    </Page>
  );
};

export default RelatorioProdutosHomologadosPage;
