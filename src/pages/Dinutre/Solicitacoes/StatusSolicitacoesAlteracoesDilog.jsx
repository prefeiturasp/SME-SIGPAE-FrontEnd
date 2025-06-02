import React from "react";
import Page from "src/components/Shareable/Page/Page";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import { PAINEL_APROVACOES, PRE_RECEBIMENTO } from "src/configs/constants";
import {
  getDashboardSolicitacoesAlteracao,
  getDashboardSolicitacoesAlteracaoComFiltros,
} from "src/services/cronograma.service";
import { SolicitacoesCronogramaStatusGenerico } from "src/components/screens/SolicitacoesCronogramaStatusGenerico";
import { CARD_SOLICITACOES_ALTERACOES_ABASTECIMENTO } from "src/components/screens/PreRecebimento/PainelAprovacoes/constants";

const atual = {
  href: CARD_SOLICITACOES_ALTERACOES_ABASTECIMENTO.href,
  titulo: CARD_SOLICITACOES_ALTERACOES_ABASTECIMENTO.titulo,
};

const limit = 10;

const paramsDefault = {
  status: CARD_SOLICITACOES_ALTERACOES_ABASTECIMENTO.incluir_status,
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
        icone={CARD_SOLICITACOES_ALTERACOES_ABASTECIMENTO.icon}
        titulo={CARD_SOLICITACOES_ALTERACOES_ABASTECIMENTO.titulo}
        cardType={CARD_SOLICITACOES_ALTERACOES_ABASTECIMENTO.style}
        getSolicitacoes={getDashboardSolicitacoesAlteracao}
        getSolicitacoesComFiltros={getDashboardSolicitacoesAlteracaoComFiltros}
        params={paramsDefault}
        limit={limit}
        alteracao={true}
      />
    </Page>
  );
};
