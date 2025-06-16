import React from "react";
import Breadcrumb from "../../components/Shareable/Breadcrumb";
import Page from "../../components/Shareable/Page/Page";
import { HOME } from "./constants";
import { DashboardNutrimanifestacao } from "src/components/screens/DashboardNutricionista/DashboardNutriManifestacao";

export default () => (
  <div>
    <Page>
      <Breadcrumb home={HOME} />
      <DashboardNutrimanifestacao />
    </Page>
  </div>
);
