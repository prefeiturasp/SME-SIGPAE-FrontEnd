import React from "react";

import {
  ADICIONAR_PARAMETRIZACAO_FINANCEIRA,
  MEDICAO_INICIAL,
  PARAMETRIZACAO_FINANCEIRA,
} from "src/configs/constants";

import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";

import AdicionarParametrizacaoFinanceira from "src/components/screens/LancamentoInicial/ParametrizacaoFinanceira/AdicionarParametrizacaoFinanceira";

const atual = {
  href: `/${MEDICAO_INICIAL}/${PARAMETRIZACAO_FINANCEIRA}/${ADICIONAR_PARAMETRIZACAO_FINANCEIRA}`,
  titulo: "Adicionar Parametrização",
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
  {
    href: `/${MEDICAO_INICIAL}/${PARAMETRIZACAO_FINANCEIRA}/`,
    titulo: "Parametrização Financeira",
  },
];

export const AdicionarParametrizacaoFinanceiraPage = () => (
  <Page
    titulo="Adicionar Parametrização Financeira"
    botaoVoltar
    voltarPara={`/${MEDICAO_INICIAL}/${PARAMETRIZACAO_FINANCEIRA}/`}
  >
    <Breadcrumb home={"/"} anteriores={anterior} atual={atual} />
    <AdicionarParametrizacaoFinanceira />
  </Page>
);
