import React from "react";
import Page from "components/Shareable/Page/Page";
import Breadcrumb from "components/Shareable/Breadcrumb";
import {
  ALTERACOES_REPROVADAS,
  DILOG,
  PAINEL_APROVACOES,
  PRE_RECEBIMENTO,
} from "configs/constants";
import {
  getDashboardSolicitacoesAlteracao,
  getDashboardSolicitacoesAlteracaoComFiltros,
} from "services/cronograma.service";
import { SolicitacoesCronogramaStatusGenerico } from "components/screens/SolicitacoesCronogramaStatusGenerico";
import { CARD_SOLICITACOES_REPROVADAS_DILOG } from "components/screens/PreRecebimento/PainelAprovacoes/constants";

const atual = {
  href: `/${DILOG}/${ALTERACOES_REPROVADAS}`,
  titulo: "Alterações Aprovadas",
};

const limit = 10;

const paramsDefault = { status: "REPROVADO_DILOG", offset: 0, limit: limit };

export default () => {
  const anteriores = [
    {
      href: `#`,
      titulo: "Pré-Recebimento",
    },
    {
      href: `/pre-recebimento/painel-aprovacoes`,
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
        icone={CARD_SOLICITACOES_REPROVADAS_DILOG.icon}
        titulo={CARD_SOLICITACOES_REPROVADAS_DILOG.titulo}
        cardType={CARD_SOLICITACOES_REPROVADAS_DILOG.style}
        getSolicitacoes={getDashboardSolicitacoesAlteracao}
        getSolicitacoesComFiltros={getDashboardSolicitacoesAlteracaoComFiltros}
        params={paramsDefault}
        limit={limit}
        alteracao={true}
      />
    </Page>
  );
};
