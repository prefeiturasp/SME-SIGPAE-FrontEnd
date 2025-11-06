import React from "react";

import {
  PARAMETRIZACAO_FINANCEIRA,
  MEDICAO_INICIAL,
} from "../../../configs/constants";

import Breadcrumb from "../../../components/Shareable/Breadcrumb";
import Page from "../../../components/Shareable/Page/Page";

import ParametrizacaoFinanceira from "src/components/screens/LancamentoInicial/ParametrizacaoFinanceira";

const atual = {
  href: `/${MEDICAO_INICIAL}/${PARAMETRIZACAO_FINANCEIRA}/`,
  titulo: "Parametrização Financeira",
};

const anterior = [
  {
    href: "#",
    titulo: "Medição Inicial",
  },
  {
    href: "#",
    titulo: "Cadastros",
  },
];

export const ParametrizacaoFinanceiraPage = () => (
  <Page titulo={atual.titulo} botaoVoltar voltarPara={"/"}>
    <Breadcrumb home={"/"} anteriores={anterior} atual={atual} />
    <ParametrizacaoFinanceira />
  </Page>
);
