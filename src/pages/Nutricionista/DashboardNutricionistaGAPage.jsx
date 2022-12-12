import React, { useState } from "react";
import Breadcrumb from "../../components/Shareable/Breadcrumb";
import Page from "../../components/Shareable/Page/Page";
import { DashboardNutrisupervisao } from "components/screens/DashboardNutricionista/DashboardNutrisupervisao";

export default () => (
  <div>
    <Page>
      <Breadcrumb home={"/"} />
      <DashboardNutrisupervisao />
    </Page>
  </div>
);
