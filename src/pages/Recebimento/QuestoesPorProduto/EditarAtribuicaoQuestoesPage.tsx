import React from "react";

import { HOME } from "src/constants/config";
import {
  RECEBIMENTO,
  QUESTOES_POR_PRODUTO,
  EDITAR_ATRIBUICAO_QUESTOES_CONFERENCIA,
} from "src/configs/constants";
import Page from "src/components/Shareable/Page/Page";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import AtribuirQuestoes from "src/components/screens/Recebimento/QuestoesPorProduto/AtribuirQuestoes";

const atual = {
  href: `/${RECEBIMENTO}/${EDITAR_ATRIBUICAO_QUESTOES_CONFERENCIA}`,
  titulo: "Editar Atribuição de Questões para Conferência",
};

const anteriores = [
  {
    href: `/`,
    titulo: "Recebimento",
  },
  {
    href: `/${RECEBIMENTO}/${QUESTOES_POR_PRODUTO}`,
    titulo: "Questões por Produto",
  },
];

export default () => (
  <Page
    botaoVoltar
    voltarPara={anteriores[anteriores.length - 1].href}
    titulo={atual.titulo}
  >
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
    <AtribuirQuestoes />
  </Page>
);
