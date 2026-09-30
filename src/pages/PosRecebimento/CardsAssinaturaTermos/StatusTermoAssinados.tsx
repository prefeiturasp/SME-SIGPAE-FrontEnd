import React from "react";
import Page from "src/components/Shareable/Page/Page";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import {
  POS_RECEBIMENTO,
  PAINEL_ASSINATURA_TERMOS_RECEBIMENTO,
} from "src/configs/constants";
import { getTermosAssinados } from "src/services/posRecebimento.service";
import TermosPorStatus from "src/components/screens/PosRecebimento/TermosPorStatus";
import { CARD_ASSINADOS } from "src/components/screens/PosRecebimento/PainelAssinaturaTermosRecebimento/constants";

const limit = 10;

const paramsDefault = {
  offset: 0,
  limit: limit,
};

const atual = {
  href: CARD_ASSINADOS.href,
  titulo: CARD_ASSINADOS.titulo,
};

const anteriores = [
  {
    href: `#`,
    titulo: "Pós-Recebimento",
  },
  {
    href: `/${POS_RECEBIMENTO}/${PAINEL_ASSINATURA_TERMOS_RECEBIMENTO}`,
    titulo: "Painel de Assinaturas - Termo de Recebimento",
  },
];

export default () => (
  <Page
    titulo={atual.titulo}
    botaoVoltar
    voltarPara={`/${POS_RECEBIMENTO}/${PAINEL_ASSINATURA_TERMOS_RECEBIMENTO}`}
  >
    <Breadcrumb home="/" atual={atual} anteriores={anteriores} />
    <TermosPorStatus
      icone={CARD_ASSINADOS.icon}
      titulo={CARD_ASSINADOS.titulo}
      cardType={CARD_ASSINADOS.style}
      getSolicitacoes={getTermosAssinados}
      params={paramsDefault}
      limit={limit}
    />
  </Page>
);
