import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  CADASTRO_TERMO_RECEBIMENTO_PROVISORIO,
  POS_RECEBIMENTO,
  TERMO_RECEBIMENTO_PROVISORIO,
} from "src/configs/constants";
import CadastroTermoRecebimentoProvisorio from "src/components/screens/PosRecebimento/CadastroTermoRecebimentoProvisorio";

const atual = {
  href: `/${POS_RECEBIMENTO}/${CADASTRO_TERMO_RECEBIMENTO_PROVISORIO}`,
  titulo: "Cadastrar Termo de Recebimento Provisório",
};

const anteriores = [
  {
    href: `/`,
    titulo: "Pós-Recebimento",
  },
  {
    href: `/${POS_RECEBIMENTO}/${TERMO_RECEBIMENTO_PROVISORIO}`,
    titulo: "Termo de Recebimento Provisório",
  },
];

export default () => (
  <Page
    botaoVoltar
    voltarPara={`/${POS_RECEBIMENTO}/${TERMO_RECEBIMENTO_PROVISORIO}`}
    titulo={atual.titulo}
  >
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
    <CadastroTermoRecebimentoProvisorio />
  </Page>
);
