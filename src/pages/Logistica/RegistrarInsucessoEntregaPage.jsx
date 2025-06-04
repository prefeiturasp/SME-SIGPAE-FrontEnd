import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  INSUCESSO_ENTREGA,
  REGISTRAR_INSUCESSO,
  LOGISTICA,
} from "src/configs/constants";
import RegistrarInsucessoEntrega from "src/components/screens/Logistica/RegistrarInsucessoEntrega";

const atual = {
  href: `/${LOGISTICA}/${REGISTRAR_INSUCESSO}`,
  titulo: "Registrar Insucesso de Entrega",
};

const anteriores = [
  {
    href: `/`,
    titulo: "Abastecimento",
  },
  {
    href: `/${LOGISTICA}/${INSUCESSO_ENTREGA}`,
    titulo: "Insucesso de Entrega",
  },
];

export default () => (
  <Page
    botaoVoltar
    voltarPara={`/${LOGISTICA}/${INSUCESSO_ENTREGA}`}
    titulo={atual.titulo}
  >
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
    <RegistrarInsucessoEntrega />
  </Page>
);
