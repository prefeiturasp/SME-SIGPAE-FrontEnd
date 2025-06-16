import React from "react";

import { HOME } from "../../constants/config";

import Breadcrumb from "../../components/Shareable/Breadcrumb";
import Page from "../../components/Shareable/Page/Page";

import AtivasInativas from "../../components/screens/DietaEspecial/AtivasInativasPorAluno";

import { DIETA_ESPECIAL, ATIVAS_ANATIVAS } from "src/configs/constants";

const atual = {
  href: `/${DIETA_ESPECIAL}/${ATIVAS_ANATIVAS}`,
  titulo: "Consulta de Dieta do Aluno",
};

export default () => {
  return (
    <Page botaoVoltar voltarPara="/" titulo="Consulta de Dieta do Aluno">
      <Breadcrumb home={HOME} atual={atual} />
      <AtivasInativas />
    </Page>
  );
};
