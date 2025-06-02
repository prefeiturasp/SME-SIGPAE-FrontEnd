import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import DietaEspecialAlteracaoUE from "src/components/screens/DietaEspecial/AlteracaoUE";
import { DIETA_ESPECIAL_ALTERACAO_UE, ESCOLA } from "src/configs/constants";
import React from "react";
import { HOME } from "../constants";

const atual = {
  href: `/${ESCOLA}/${DIETA_ESPECIAL_ALTERACAO_UE}`,
  titulo: "Solicitação de alteração de U.E da dieta especial",
};

export const AlteracaoUEPage = () => (
  <Page titulo={atual.titulo} botaoVoltar>
    <Breadcrumb home={HOME} atual={atual} />
    <DietaEspecialAlteracaoUE />
  </Page>
);
