import React from "react";
import Page from "src/components/Shareable/Page/Page";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import {
  POS_RECEBIMENTO,
  PAINEL_ASSINATURA_TERMOS_RECEBIMENTO,
} from "src/configs/constants";
import { getTermosPendentesAssinatura } from "src/services/posRecebimento.service";
import TermosPorStatus from "src/components/screens/PosRecebimento/TermosPorStatus";
import { CARD_PENDENTES_ASSINATURA } from "src/components/screens/PosRecebimento/PainelAssinaturaTermosRecebimento/constants";

const limit = 10;

const paramsDefault = {
  offset: 0,
  limit: limit,
};

const atual = {
  href: CARD_PENDENTES_ASSINATURA.href,
  titulo: CARD_PENDENTES_ASSINATURA.titulo,
};

const anteriores = [
  {
    href: `#`,
    titulo: "Pós-Recebimento",
  },
  {
    href: `/${POS_RECEBIMENTO}/${PAINEL_ASSINATURA_TERMOS_RECEBIMENTO}`,
    titulo: "Painel de Assinaturas",
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
      icone={CARD_PENDENTES_ASSINATURA.icon}
      titulo={CARD_PENDENTES_ASSINATURA.titulo}
      cardType={CARD_PENDENTES_ASSINATURA.style}
      getSolicitacoes={getTermosPendentesAssinatura}
      params={paramsDefault}
      limit={limit}
    />
  </Page>
);
