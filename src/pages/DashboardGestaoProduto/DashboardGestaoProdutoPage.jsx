import React from "react";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import { DashboardGestaoProduto } from "src/components/screens/DashboardGestaoProduto";
import { PAINEL_GESTAO_PRODUTO } from "src/configs/constants";
import Page from "src/components/Shareable/Page/Page";

const DashboardGestaoProdutoPage = (props) => {
  return (
    <Page titulo="Acompanhamento de produtos cadastrados">
      <Breadcrumb
        home={"/"}
        atual={{
          href: `/${PAINEL_GESTAO_PRODUTO}`,
          titulo: "Painel de Solicitações",
        }}
      />
      <DashboardGestaoProduto {...props} />
    </Page>
  );
};

export default DashboardGestaoProdutoPage;
