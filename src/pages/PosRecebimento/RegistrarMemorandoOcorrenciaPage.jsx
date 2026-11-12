import React from "react";

import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import RegistrarMemorandoOcorrencia from "src/components/screens/PosRecebimento/RegistrarMemorandoOcorrencia";
import { HOME } from "src/constants/config";
import {
  MEMORANDO_OCORRENCIAS,
  POS_RECEBIMENTO,
  REGISTRAR_MEMORANDO_OCORRENCIA,
} from "src/configs/constants";

const atual = {
  href: `/${POS_RECEBIMENTO}/${MEMORANDO_OCORRENCIAS}/${REGISTRAR_MEMORANDO_OCORRENCIA}`,
  titulo: "Registrar Ocorrência com Alimentos Recebidos da CODAE",
};

const anteriores = [
  {
    href: "/",
    titulo: "Pós-Recebimento",
  },
  {
    href: `/${POS_RECEBIMENTO}/${MEMORANDO_OCORRENCIAS}`,
    titulo: "Memorando de Ocorrências",
  },
];

export default () => (
  <Page
    botaoVoltar
    voltarPara={`/${POS_RECEBIMENTO}/${MEMORANDO_OCORRENCIAS}`}
    titulo={atual.titulo}
  >
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
    <RegistrarMemorandoOcorrencia />
  </Page>
);
