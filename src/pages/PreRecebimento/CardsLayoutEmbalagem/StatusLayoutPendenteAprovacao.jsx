import React from "react";
import Page from "components/Shareable/Page/Page";
import Breadcrumb from "components/Shareable/Breadcrumb";
import { PAINEL_LAYOUT_EMBALAGEM, PRE_RECEBIMENTO } from "configs/constants";
import { getDashboardLayoutEmbalagem } from "services/layoutEmbalagem.service";
import { SolicitacoesLayoutStatusGenerico } from "components/screens/SolicitacoesLayoutStatusGenerico";
import { CARD_PENDENTES_APROVACAO } from "../../../components/screens/PreRecebimento/PainelLayoutEmbalagem/constants";

const atual = {
  href: CARD_PENDENTES_APROVACAO.href,
  titulo: CARD_PENDENTES_APROVACAO.titulo,
};

const limit = 10;

const paramsDefault = {
  status: CARD_PENDENTES_APROVACAO.incluir_status,
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
      href: `/${PRE_RECEBIMENTO}/${PAINEL_LAYOUT_EMBALAGEM}`,
      titulo: "Layout de Embalagens",
    },
  ];

  return (
    <Page
      titulo={atual.titulo}
      botaoVoltar
      voltarPara={`/${PRE_RECEBIMENTO}/${PAINEL_LAYOUT_EMBALAGEM}`}
    >
      <Breadcrumb home="/" atual={atual} anteriores={anteriores} />
      <SolicitacoesLayoutStatusGenerico
        icone={CARD_PENDENTES_APROVACAO.icon}
        titulo={CARD_PENDENTES_APROVACAO.titulo}
        cardType={CARD_PENDENTES_APROVACAO.style}
        getSolicitacoes={getDashboardLayoutEmbalagem}
        params={paramsDefault}
        limit={limit}
      />
    </Page>
  );
};
