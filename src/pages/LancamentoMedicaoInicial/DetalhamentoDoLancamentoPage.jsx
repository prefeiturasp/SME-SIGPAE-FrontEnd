import React from "react";

import { HOME } from "src/constants/config";

import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";

import LancamentoMedicaoInicial from "src/components/screens/LancamentoInicial/LancamentoMedicaoInicial";
import {
  ACOMPANHAMENTO_DE_LANCAMENTOS,
  DETALHAMENTO_DO_LANCAMENTO,
  MEDICAO_INICIAL,
} from "src/configs/constants";

const atual = {
  href: `/${MEDICAO_INICIAL}/${DETALHAMENTO_DO_LANCAMENTO}`,
  titulo: "Detalhamento do Lançamento",
};

const anteriores = [
  {
    href: `/${MEDICAO_INICIAL}/${ACOMPANHAMENTO_DE_LANCAMENTOS}`,
    titulo: "Medição Inicial",
  },
];

export const DetalhamentoDoLancamentoPage = () => (
  <Page botaoVoltar titulo={"Detalhamento do Lançamento da Medição Inicial"}>
    <Breadcrumb home={HOME} anteriores={anteriores} atual={atual} />
    <LancamentoMedicaoInicial />
  </Page>
);
