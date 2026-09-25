import React from "react";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  POS_RECEBIMENTO,
  PAINEL_ASSINATURA_TERMOS_RECEBIMENTO,
} from "src/configs/constants";
import PainelAssinaturaTermosRecebimento from "src/components/screens/PosRecebimento/PainelAssinaturaTermosRecebimento";

const atual = {
  href: `/${POS_RECEBIMENTO}/${PAINEL_ASSINATURA_TERMOS_RECEBIMENTO}`,
  titulo: "Painel de Assinaturas - Termo de Recebimento Definitivo",
};

const anteriores = [
  {
    href: `/`,
    titulo: "Pós-Recebimento",
  },
];

export default () => (
  <Page botaoVoltar voltarPara="/" titulo={atual.titulo}>
    <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
    <PainelAssinaturaTermosRecebimento />
  </Page>
);
