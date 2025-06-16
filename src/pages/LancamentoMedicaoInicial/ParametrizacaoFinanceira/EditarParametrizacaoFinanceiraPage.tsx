import React from "react";

import {
  EDITAR_PARAMETRIZACAO_FINANCEIRA,
  PARAMETRIZACAO_FINANCEIRA,
  MEDICAO_INICIAL,
} from "../../../configs/constants";

import Breadcrumb from "../../../components/Shareable/Breadcrumb";
import Page from "../../../components/Shareable/Page/Page";

import AdicionarParametrizacaoFinanceira from "src/components/screens/LancamentoInicial/ParametrizacaoFinanceira/AdicionarParametrizacaoFinanceira";

const atual = {
  href: `/${MEDICAO_INICIAL}/${PARAMETRIZACAO_FINANCEIRA}/${EDITAR_PARAMETRIZACAO_FINANCEIRA}`,
  titulo: "Editar Parametrização",
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

export const EditarParametrizacaoFinanceiraPage = () => (
  <Page titulo="Editar Parametrização Financeira" botaoVoltar>
    <Breadcrumb home={"/"} anteriores={anterior} atual={atual} />
    <AdicionarParametrizacaoFinanceira />
  </Page>
);
