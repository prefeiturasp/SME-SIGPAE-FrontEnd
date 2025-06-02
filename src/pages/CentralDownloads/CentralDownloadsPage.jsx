import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import { CENTRAL_DOWNLOADS } from "src/configs/constants";
import CentralDownloads from "src/components/screens/CentralDownloads";

const atual = {
  href: `/${CENTRAL_DOWNLOADS}`,
  titulo: "Central de Downloads",
};

export default () => (
  <Page botaoVoltar voltarPara="/" titulo={atual.titulo}>
    <Breadcrumb home={HOME} atual={atual} />
    <CentralDownloads />
  </Page>
);
