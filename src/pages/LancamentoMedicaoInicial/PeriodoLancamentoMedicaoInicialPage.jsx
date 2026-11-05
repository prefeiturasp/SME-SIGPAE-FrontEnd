import React from "react";
import { useLocation } from "react-router-dom";

import { HOME } from "src/constants/config";

import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";

import PeriodoLancamentoEscolaAberta from "src/components/screens/LancamentoInicial/PeriodoLancamentoEscolaAberta";
import PeriodoLancamentoMedicaoInicial from "src/components/screens/LancamentoInicial/PeriodoLancamentoMedicaoInicial";
import {
  LANCAMENTO_INICIAL,
  LANCAMENTO_MEDICAO_INICIAL,
  PERIODO_LANCAMENTO,
} from "src/configs/constants";

const anteriores = [
  {
    href: `/${LANCAMENTO_INICIAL}/${LANCAMENTO_MEDICAO_INICIAL}`,
    titulo: "Medição Inicial",
  },
];

const atual = {
  href: `/${LANCAMENTO_INICIAL}/${LANCAMENTO_MEDICAO_INICIAL}/${PERIODO_LANCAMENTO}`,
  titulo: "Lançamento Medição Inicial",
};

export const PeriodoLancamentoMedicaoInicialPage = () => {
  const location = useLocation();
  const ehPeriodoEscolaAberta = location.state?.grupo === "Escola Aberta";

  return (
    <Page titulo={atual.titulo}>
      <Breadcrumb home={HOME} anteriores={anteriores} atual={atual} />
      {ehPeriodoEscolaAberta ? (
        <PeriodoLancamentoEscolaAberta />
      ) : (
        <PeriodoLancamentoMedicaoInicial />
      )}
    </Page>
  );
};
