import { CARD_PENDENTES_APROVACAO } from "components/screens/PreRecebimento/PainelLayoutEmbalagem/constants";
import { SolicitacoesLayoutStatusGenerico } from "components/screens/SolicitacoesLayoutStatusGenerico";
import Breadcrumb from "components/Shareable/Breadcrumb";
import Page from "components/Shareable/Page/Page";
import {
  ANALISAR_LAYOUT_EMBALAGEM,
  DETALHAR_LAYOUT_EMBALAGEM,
  PAINEL_LAYOUT_EMBALAGEM,
  PRE_RECEBIMENTO,
} from "configs/constants";
import {
  usuarioEhCronograma,
  usuarioEhDilogAbastecimento,
} from "helpers/utilities";
import React from "react";
import { getDashboardLayoutEmbalagem } from "services/layoutEmbalagem.service";

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

  const getURLBaseItem = () => {
    if (usuarioEhDilogAbastecimento() || usuarioEhCronograma()) {
      return `/${PRE_RECEBIMENTO}/${DETALHAR_LAYOUT_EMBALAGEM}`;
    }
    return `/${PRE_RECEBIMENTO}/${ANALISAR_LAYOUT_EMBALAGEM}`;
  };

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
        urlBaseItem={getURLBaseItem()}
      />
    </Page>
  );
};
