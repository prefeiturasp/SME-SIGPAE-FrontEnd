import React from "react";
import Page from "src/components/Shareable/Page/Page";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import { PAINEL_APROVACOES, PRE_RECEBIMENTO } from "src/configs/constants";
import {
  getDashboardCronograma,
  getDashboardCronogramaComFiltros,
} from "src/services/cronograma.service";
import { SolicitacoesCronogramaStatusGenerico } from "src/components/screens/SolicitacoesCronogramaStatusGenerico";
import { CARD_CRONOGRAMAS_ASSINADOS } from "src/components/screens/PreRecebimento/PainelAprovacoes/constants";

const atual = {
  href: CARD_CRONOGRAMAS_ASSINADOS.href,
  titulo: CARD_CRONOGRAMAS_ASSINADOS.titulo,
};

const limit = 10;

const paramsDefault = {
  status: CARD_CRONOGRAMAS_ASSINADOS.incluir_status,
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
        icone={CARD_CRONOGRAMAS_ASSINADOS.icon}
        titulo={CARD_CRONOGRAMAS_ASSINADOS.titulo}
        cardType={CARD_CRONOGRAMAS_ASSINADOS.style}
        getSolicitacoes={getDashboardCronograma}
        getSolicitacoesComFiltros={getDashboardCronogramaComFiltros}
        params={paramsDefault}
        limit={limit}
      />
    </Page>
  );
};
