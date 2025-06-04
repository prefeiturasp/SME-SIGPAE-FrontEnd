import React from "react";

import { HOME } from "src/constants/config";

import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";

import LancamentoMedicaoInicial from "src/components/screens/LancamentoInicial/LancamentoMedicaoInicial";
import {
  LANCAMENTO_INICIAL,
  LANCAMENTO_MEDICAO_INICIAL,
} from "src/configs/constants";

const atual = {
  href: `/${LANCAMENTO_INICIAL}/${LANCAMENTO_MEDICAO_INICIAL}`,
  titulo: "Medição Inicial",
};

export const LancamentoMedicaoInicialPage = () => (
  <Page botaoVoltar titulo={"Lançamento Medição Inicial"}>
    <Breadcrumb home={HOME} atual={atual} />
    <LancamentoMedicaoInicial />
  </Page>
);
