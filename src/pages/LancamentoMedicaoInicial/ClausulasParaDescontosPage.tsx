import React from "react";
import Breadcrumb from "../../components/Shareable/Breadcrumb";
import Page from "../../components/Shareable/Page/Page";
import {
  CLAUSULAS_PARA_DESCONTOS,
  MEDICAO_INICIAL,
} from "../../configs/constants";
import { ClausulasParaDescontos } from "src/components/screens/LancamentoInicial/ClausulasParaDescontos";

const atual = {
  href: `/${MEDICAO_INICIAL}/${CLAUSULAS_PARA_DESCONTOS}/`,
  titulo: "Cláusulas para Descontos",
};

const anterior = [
  {
    href: "#",
    titulo: "Medição Inicial",
  },
  {
    href: "#",
    titulo: "Cadastros",
  },
];

export const ClausulasParaDescontosPage = () => (
  <Page titulo={atual.titulo} botaoVoltar voltarPara={"/"}>
    <Breadcrumb home={"/"} anteriores={anterior} atual={atual} />
    <ClausulasParaDescontos />
  </Page>
);
