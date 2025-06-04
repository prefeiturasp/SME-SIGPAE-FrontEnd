import React from "react";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import { DashboardGestaoProduto } from "src/components/screens/DashboardGestaoProduto";
import Page from "src/components/Shareable/Page/Page";

const DashboardGestaoProdutoPage = (props) => {
  return (
    <Page titulo="Acompanhamento de produtos cadastrados">
      <Breadcrumb home={"/"} />
      <DashboardGestaoProduto {...props} />
    </Page>
  );
};

export default DashboardGestaoProdutoPage;
