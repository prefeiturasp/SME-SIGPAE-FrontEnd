import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  NOTIFICAR_EMPRESA,
  LOGISTICA,
  GUIAS_NOTIFICACAO,
} from "src/configs/constants";
import NotificarEmpresa from "src/components/screens/Logistica/NotificarEmpresa";

const atual = {
  href: `/${LOGISTICA}/${NOTIFICAR_EMPRESA}`,
  titulo: "Notificar Empresa",
};

const anteriores = [
  {
    href: `/`,
    titulo: "Abastecimento",
  },
];

export default () => (
  <Page
    botaoVoltar
    voltarPara={`/${LOGISTICA}/${GUIAS_NOTIFICACAO}`}
    titulo={atual.titulo}
  >
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
    <NotificarEmpresa />
  </Page>
);
