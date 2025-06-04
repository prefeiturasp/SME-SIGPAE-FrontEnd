import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import { ATUALIZACAO_EMAIL_EOL, CONFIGURACOES } from "src/configs/constants";
import AtualizacaoEmailEOL from "src/components/screens/Configuracoes/AtualizacaoEmailEOL";

const atual = {
  href: `/${CONFIGURACOES}/${ATUALIZACAO_EMAIL_EOL}`,
  titulo: "Atualização de E-mail do EOL",
};

const anteriores = [
  {
    href: `/`,
    titulo: "Configurações",
  },
  {
    href: `/`,
    titulo: "Gestão de Usuários",
  },
];

export default () => (
  <Page botaoVoltar voltarPara="/" titulo={atual.titulo}>
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
    <AtualizacaoEmailEOL />
  </Page>
);
