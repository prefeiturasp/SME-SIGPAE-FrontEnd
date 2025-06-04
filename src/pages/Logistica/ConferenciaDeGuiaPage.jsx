import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  CONFERIR_ENTREGA,
  CONFERENCIA_GUIA,
  LOGISTICA,
} from "src/configs/constants";
import ConferenciaDeGuia from "src/components/screens/Logistica/ConferenciaDeGuia";

const atual = {
  href: `/${LOGISTICA}/${CONFERENCIA_GUIA}`,
  titulo: "Conferência da Guia de Remessa",
};

const anteriores = [
  {
    href: `/`,
    titulo: "Abastecimento",
  },
  {
    href: `/${LOGISTICA}/${CONFERIR_ENTREGA}`,
    titulo: "Conferir Entrega",
  },
];

export default () => (
  <Page
    botaoVoltar
    voltarPara={`/${LOGISTICA}/${CONFERIR_ENTREGA}`}
    titulo={atual.titulo}
  >
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
    <ConferenciaDeGuia />
  </Page>
);
