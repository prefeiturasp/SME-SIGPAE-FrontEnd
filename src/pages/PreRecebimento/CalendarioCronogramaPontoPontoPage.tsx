import React from "react";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import { CalendarioCronogramaPontoPonto } from "src/components/Shareable/CalendarioCronogramaPontoPonto/CalendarioCronogramaPontoPonto";
import Page from "src/components/Shareable/Page/Page";
import {
  CALENDARIO_CRONOGRAMA_PONTO_A_PONTO_SEMANAL,
  PRE_RECEBIMENTO,
} from "src/configs/constants";
import { HOME } from "src/constants/config";
import { getCalendarioCronogramasPontoPonto } from "src/services/cronograma.service";

const atual = {
  href: `/${PRE_RECEBIMENTO}/${CALENDARIO_CRONOGRAMA_PONTO_A_PONTO_SEMANAL}`,
  titulo: "Calendário Ponto a Ponto",
};

const anteriores = [
  {
    href: `/`,
    titulo: "Pré-Recebimento",
  },
];

export default () => (
  <Page botaoVoltar voltarPara="/" titulo={atual.titulo}>
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
    <CalendarioCronogramaPontoPonto
      getObjetos={getCalendarioCronogramasPontoPonto}
      nomeObjeto="Cronogramas"
      nomeObjetoMinusculo="cronogramas"
    />
  </Page>
);
