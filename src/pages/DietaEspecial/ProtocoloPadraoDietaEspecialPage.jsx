import React from "react";

import { HOME } from "src/constants/config";

import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";

import CadastroProtocoloPadraoDietaEsp from "src/components/screens/DietaEspecial/CadastroProtocoloPadraoDietaEsp";
import {
  DIETA_ESPECIAL,
  PROTOCOLO_PADRAO_DIETA,
  CONSULTA_PROTOCOLO_PADRAO_DIETA,
} from "src/configs/constants";

const atual = {
  href: `/${DIETA_ESPECIAL}/${PROTOCOLO_PADRAO_DIETA}`,
  titulo: "Cadastro de Protocolo Padrão de Dieta Especial",
};

const anteriores = [
  {
    href: `/${DIETA_ESPECIAL}/${CONSULTA_PROTOCOLO_PADRAO_DIETA}`,
    titulo: "Consultar Protocolo Padrão",
  },
];

export default () => (
  <Page
    botaoVoltar
    voltarPara="/dieta-especial/consultar-protocolo-padrao-dieta"
    titulo={atual.titulo}
  >
    <Breadcrumb home={HOME} anteriores={anteriores} atual={atual} />
    <CadastroProtocoloPadraoDietaEsp />
  </Page>
);
