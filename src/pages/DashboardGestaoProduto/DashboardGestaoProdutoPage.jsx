import React from "react";
import Breadcrumb from "components/Shareable/Breadcrumb";
import { DashboardGestaoProduto } from "components/screens/DashboardGestaoProduto";
import Page from "components/Shareable/Page/Page";

const DashboardGestaoProdutoPage = (props) => {
  return (
    <Page titulo="Acompanhamento de produtos cadastrados">
      <Breadcrumb home={"/"} />
      <DashboardGestaoProduto {...props} />
    </Page>
  );
};

export default DashboardGestaoProdutoPage;
