import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  CONFERIR_ENTREGA,
  DETALHAMENTO_GUIA,
  LOGISTICA,
} from "src/configs/constants";
import DetalhamentoGuia from "src/components/screens/Logistica/DetalhamentoGuia";

const atual = {
  href: `/${LOGISTICA}/${DETALHAMENTO_GUIA}`,
  titulo: "Detalhamento da Guia de Remessa",
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
    <DetalhamentoGuia />
  </Page>
);
