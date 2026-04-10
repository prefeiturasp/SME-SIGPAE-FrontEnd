import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import { CRONOGRAMA_SEMANAL_FLV, PRE_RECEBIMENTO } from "src/configs/constants";
import CronogramaSemanalFLV from "src/components/screens/PreRecebimento/CronogramaSemanalFLV";

const atual = {
  href: `/${PRE_RECEBIMENTO}/${CRONOGRAMA_SEMANAL_FLV}`,
  titulo: "Cronograma Semanal FLV",
};

const anteriores = [
  {
    href: `/`,
    titulo: "Pré-Recebimento",
  },
];

const CronogramaSemanalFLVPage = () => (
  <Page botaoVoltar voltarPara="/" titulo={atual.titulo}>
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
    <CronogramaSemanalFLV />
  </Page>
);

export default CronogramaSemanalFLVPage;
