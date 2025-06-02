import React from "react";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import { Container } from "src/components/screens/DashboardTerceirizada/DashboardTerceirizadaContainer";
import { HOME } from "./constants";

export default (props) => (
  <div>
    <Page>
      <Breadcrumb home={HOME} />
      <Container {...props} />
    </Page>
  </div>
);
