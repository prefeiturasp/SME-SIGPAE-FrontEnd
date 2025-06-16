import React from "react";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import { Container } from "src/components/screens/DashboardCODAE/Container";
import { HOME } from "./constants";

export default () => (
  <div>
    <Page>
      <Breadcrumb home={HOME} />
      <Container />
    </Page>
  </div>
);
