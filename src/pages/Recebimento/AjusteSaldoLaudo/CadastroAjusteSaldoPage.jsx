import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  AJUSTE_SALDO_LAUDO,
  CADASTRO_SALDO_LAUDO,
  RECEBIMENTO,
} from "src/configs/constants";
import CadastrarAjusteSaldo from "src/components/screens/Recebimento/SaldoLaudo/components/Cadastrar";

const atual = {
  href: `/${RECEBIMENTO}/${CADASTRO_SALDO_LAUDO}`,
  titulo: "Cadastrar Saldo do Laudo",
};

const anteriores = [
  {
    href: `/${RECEBIMENTO}/`,
    titulo: "Recebimento",
  },
  {
    href: `/${RECEBIMENTO}/${AJUSTE_SALDO_LAUDO}`,
    titulo: "Ajuste de Saldo do Laudo",
  },
];

export default () => (
  <Page
    botaoVoltar
    voltarPara={`/${RECEBIMENTO}/${AJUSTE_SALDO_LAUDO}`}
    titulo={atual.titulo}
  >
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
    <CadastrarAjusteSaldo />
  </Page>
);
