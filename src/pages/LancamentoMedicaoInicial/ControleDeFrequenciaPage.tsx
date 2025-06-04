import React from "react";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import { MEDICAO_INICIAL, CONTROLE_DE_FREQUENCIA } from "src/configs/constants";
import { ControleDeFrequencia } from "src/components/screens/LancamentoInicial/ControleDeFrequencia";

const atual = {
  href: `/${MEDICAO_INICIAL}/${CONTROLE_DE_FREQUENCIA}`,
  titulo: "Controle de Frequência de Alunos",
};

const anterior = [
  {
    href: "#",
    titulo: "Medição Inicial",
  },
];

export const ControleDeFrequenciaPage = () => (
  <Page titulo={atual.titulo} botaoVoltar voltarPara={"/"}>
    <Breadcrumb home={"/"} anteriores={anterior} atual={atual} />
    <ControleDeFrequencia />
  </Page>
);
