import React from "react";
import Page from "components/Shareable/Page/Page";
import Breadcrumb from "components/Shareable/Breadcrumb";
import { PAINEL_APROVACOES, PRE_RECEBIMENTO } from "configs/constants";
import {
  getDashboardCronograma,
  getDashboardCronogramaComFiltros,
} from "services/cronograma.service";
import { CARD_PENDENTES_ASSINATURA } from "components/screens/PreRecebimento/PainelAprovacoes/constants";

import { SolicitacoesCronogramaStatusGenerico } from "components/screens/SolicitacoesCronogramaStatusGenerico";

const atual = {
  href: CARD_PENDENTES_ASSINATURA.href,
  titulo: CARD_PENDENTES_ASSINATURA.titulo,
};

const limit = 10;

const paramsDefault = {
  status: CARD_PENDENTES_ASSINATURA.incluir_status,
  offset: 0,
  limit: limit,
};

export default () => {
  const anteriores = [
    {
      href: `#`,
      titulo: "Pré-Recebimento",
    },
    {
      href: `/${PRE_RECEBIMENTO}/${PAINEL_APROVACOES}`,
      titulo: "Painel de Aprovações",
    },
  ];

  return (
    <Page
      titulo={atual.titulo}
      botaoVoltar
      voltarPara={`/${PRE_RECEBIMENTO}/${PAINEL_APROVACOES}`}
    >
      <Breadcrumb home="/" atual={atual} anteriores={anteriores} />
      <SolicitacoesCronogramaStatusGenerico
        icone={CARD_PENDENTES_ASSINATURA.icon}
        titulo={CARD_PENDENTES_ASSINATURA.titulo}
        cardType={CARD_PENDENTES_ASSINATURA.style}
        getSolicitacoes={getDashboardCronograma}
        getSolicitacoesComFiltros={getDashboardCronogramaComFiltros}
        params={paramsDefault}
        limit={limit}
      />
    </Page>
  );
};
