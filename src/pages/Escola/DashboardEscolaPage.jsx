import { DashboardEscola } from "src/components/screens/DashboardEscola";
import React from "react";
import Breadcrumb from "../../components/Shareable/Breadcrumb";
import Page from "../../components/Shareable/Page/Page";
import { HOME } from "./constants";

export default () => (
  <>
    <div>
      <Page>
        <Breadcrumb home={HOME} />
        <DashboardEscola />
      </Page>
    </div>
  </>
);
