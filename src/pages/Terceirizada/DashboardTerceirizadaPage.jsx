import React from "react";
import Breadcrumb from "components/Shareable/Breadcrumb";
import Page from "components/Shareable/Page/Page";
import { Container } from "components/screens/DashboardTerceirizada/DashboardTerceirizadaContainer";
import { HOME } from "./constants";

export default (props) => (
  <div>
    <Page>
      <Breadcrumb home={HOME} />
      <Container {...props} />
    </Page>
  </div>
);
