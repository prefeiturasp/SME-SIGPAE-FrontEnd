import React from "react";
import Breadcrumb from "../../components/Shareable/Breadcrumb";
import Page from "../../components/Shareable/Page/Page";
import { EMPENHOS, MEDICAO_INICIAL } from "../../configs/constants";
import { Empenhos } from "src/components/screens/LancamentoInicial/Empenhos";

const atual = {
  href: `/${MEDICAO_INICIAL}/${EMPENHOS}/`,
  titulo: "Empenhos",
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

export const EmpenhosPage = () => (
  <Page titulo={atual.titulo} botaoVoltar voltarPara={"/"}>
    <Breadcrumb home={"/"} anteriores={anterior} atual={atual} />
    <Empenhos />
  </Page>
);
