import React from "react";
import Breadcrumb from "../../../components/Shareable/Breadcrumb";
import Page from "../../../components/Shareable/Page/Page";
import OrdersDashboardContainer from "../../../components/SolicitacaoDeKitLanche/DRE/OrdersDashboardContainer";
import { HOME } from "../constants";

const atual = {
  href: "kits-lanche",
  titulo: "Solicitações de Kit Lanche"
};

export default () => (
  <Page>
    <Breadcrumb home={HOME} atual={atual} />
    <OrdersDashboardContainer />
  </Page>
);
