import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  CADASTRO_CRONOGRAMA_SEMANAL,
  PRE_RECEBIMENTO,
  CRONOGRAMA_SEMANAL_FLV,
} from "src/configs/constants";
import CadastrarCronogramaSemanal from "src/components/screens/PreRecebimento/CronogramaSemanalFLV/components/Cadastrar";

const atual = {
  href: `/${PRE_RECEBIMENTO}/${CADASTRO_CRONOGRAMA_SEMANAL}`,
  titulo: "Cadastrar Cronograma Semanal",
};

const anteriores = [
  {
    href: `/${PRE_RECEBIMENTO}/${CRONOGRAMA_SEMANAL_FLV}`,
    titulo: "Cronograma Semanal FLV",
  },
];

const CadastroCronogramaSemanalPage = () => (
  <Page
    botaoVoltar
    voltarPara={`/${PRE_RECEBIMENTO}/${CRONOGRAMA_SEMANAL_FLV}`}
    titulo={atual.titulo}
  >
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
    <CadastrarCronogramaSemanal />
  </Page>
);

export default CadastroCronogramaSemanalPage;
