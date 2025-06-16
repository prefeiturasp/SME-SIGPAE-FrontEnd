import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import { CALENDARIO_CRONOGRAMA, PRE_RECEBIMENTO } from "src/configs/constants";
import { CalendarioCronograma } from "src/components/Shareable/CalendarioCronograma";
import { getCalendarioCronogramas } from "src/services/cronograma.service";

const atual = {
  href: `/${PRE_RECEBIMENTO}/${CALENDARIO_CRONOGRAMA}`,
  titulo: "Calendário de Cronogramas",
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
    <CalendarioCronograma
      getObjetos={getCalendarioCronogramas}
      nomeObjeto="Cronogramas"
      nomeObjetoMinusculo="cronogramas"
    />
  </Page>
);
