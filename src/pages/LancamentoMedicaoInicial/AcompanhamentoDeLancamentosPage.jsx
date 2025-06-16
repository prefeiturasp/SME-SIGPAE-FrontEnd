import React from "react";

import { HOME } from "src/constants/config";

import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";

import { AcompanhamentoDeLancamentos } from "src/components/screens/LancamentoInicial/AcompanhamentoDeLancamentos";
import {
  ACOMPANHAMENTO_DE_LANCAMENTOS,
  MEDICAO_INICIAL,
} from "src/configs/constants";

const atual = {
  href: `/${MEDICAO_INICIAL}/${ACOMPANHAMENTO_DE_LANCAMENTOS}`,
  titulo: "Medição Inicial",
};

export const AcompanhamentoDeLancamentosPage = () => (
  <Page botaoVoltar voltarPara={HOME} titulo={"Acompanhamento de Lançamentos"}>
    <Breadcrumb home={HOME} atual={atual} />
    <AcompanhamentoDeLancamentos />
  </Page>
);
