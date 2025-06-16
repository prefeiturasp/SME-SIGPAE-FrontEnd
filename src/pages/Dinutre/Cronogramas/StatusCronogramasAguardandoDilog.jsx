import React from "react";
import Page from "src/components/Shareable/Page/Page";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import { PAINEL_APROVACOES, PRE_RECEBIMENTO } from "src/configs/constants";
import {
  getDashboardCronograma,
  getDashboardCronogramaComFiltros,
} from "src/services/cronograma.service";
import { SolicitacoesCronogramaStatusGenerico } from "src/components/screens/SolicitacoesCronogramaStatusGenerico";
import { CARD_AGUARDANDO_ASSINATURA } from "src/components/screens/PreRecebimento/PainelAprovacoes/constants";

const atual = {
  href: CARD_AGUARDANDO_ASSINATURA.href,
  titulo: CARD_AGUARDANDO_ASSINATURA.titulo,
};

const limit = 10;

const paramsDefault = {
  status: CARD_AGUARDANDO_ASSINATURA.incluir_status,
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
        icone={CARD_AGUARDANDO_ASSINATURA.icon}
        titulo={CARD_AGUARDANDO_ASSINATURA.titulo}
        cardType={CARD_AGUARDANDO_ASSINATURA.style}
        getSolicitacoes={getDashboardCronograma}
        getSolicitacoesComFiltros={getDashboardCronogramaComFiltros}
        params={paramsDefault}
        limit={limit}
      />
    </Page>
  );
};
