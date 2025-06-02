import React from "react";

import { HOME } from "src/constants/config";

import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";

import ConsultaCadastroProtocoloPadraoDieta from "src/components/screens/DietaEspecial/ConsultaProtocoloPadraoDieta";
import {
  DIETA_ESPECIAL,
  CONSULTA_PROTOCOLO_PADRAO_DIETA,
} from "src/configs/constants";

const atual = {
  href: `/${DIETA_ESPECIAL}/${CONSULTA_PROTOCOLO_PADRAO_DIETA}`,
  titulo: "Consultar Protocolo Padrão",
};

export default () => (
  <Page botaoVoltar voltarPara="/" titulo={atual.titulo}>
    <Breadcrumb home={HOME} atual={atual} />
    <ConsultaCadastroProtocoloPadraoDieta />
  </Page>
);
