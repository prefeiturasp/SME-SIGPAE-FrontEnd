import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  CADASTRO_CRONOGRAMA,
  CRONOGRAMA_ENTREGA,
  PRE_RECEBIMENTO,
} from "src/configs/constants";
import CadastroCronograma from "src/components/screens/PreRecebimento/CadastroCronograma";

const atual = {
  href: `/${PRE_RECEBIMENTO}/${CADASTRO_CRONOGRAMA}`,
  titulo: "Cadastrar Cronograma",
};

const anteriores = [
  {
    href: `/`,
    titulo: "Pré-Recebimento",
  },
  {
    href: `/${PRE_RECEBIMENTO}/${CRONOGRAMA_ENTREGA}`,
    titulo: "Cronograma de Entrega",
  },
];

export default () => (
  <Page
    botaoVoltar
    temModalVoltar
    textoModalVoltar="Existem informações não salvas no Cronograma. 
    Ao voltar à tela anterior, as informações inseridas serão perdidas."
    voltarPara={`/${PRE_RECEBIMENTO}/${CRONOGRAMA_ENTREGA}`}
    titulo={atual.titulo}
  >
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
    <CadastroCronograma />
  </Page>
);
