import React from "react";

import {
  PAINEL_LAYOUT_EMBALAGEM,
  PRE_RECEBIMENTO,
  DETALHAR_LAYOUT_EMBALAGEM,
  ANALISAR_LAYOUT_EMBALAGEM,
} from "configs/constants";
import { usuarioPodeAnalisarLayoutEmbalagem } from "helpers/utilities";
import { getDashboardLayoutEmbalagem } from "services/layoutEmbalagem.service";
import Page from "components/Shareable/Page/Page";
import Breadcrumb from "components/Shareable/Breadcrumb";
import { SolicitacoesLayoutStatusGenerico } from "components/screens/SolicitacoesLayoutStatusGenerico";
import { CARD_APROVADOS } from "components/screens/PreRecebimento/PainelLayoutEmbalagem/constants";

const atual = {
  href: CARD_APROVADOS.href,
  titulo: CARD_APROVADOS.titulo,
};

const limit = 10;

const paramsDefault = {
  status: CARD_APROVADOS.incluir_status,
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

  const urlBaseItem = usuarioPodeAnalisarLayoutEmbalagem()
    ? `/${PRE_RECEBIMENTO}/${ANALISAR_LAYOUT_EMBALAGEM}`
    : `/${PRE_RECEBIMENTO}/${DETALHAR_LAYOUT_EMBALAGEM}`;

  return (
    <Page
      titulo={atual.titulo}
      botaoVoltar
      voltarPara={`/${PRE_RECEBIMENTO}/${PAINEL_LAYOUT_EMBALAGEM}`}
    >
      <Breadcrumb home="/" atual={atual} anteriores={anteriores} />
      <SolicitacoesLayoutStatusGenerico
        icone={CARD_APROVADOS.icon}
        titulo={CARD_APROVADOS.titulo}
        cardType={CARD_APROVADOS.style}
        getSolicitacoes={getDashboardLayoutEmbalagem}
        params={paramsDefault}
        limit={limit}
        urlBaseItem={urlBaseItem}
      />
    </Page>
  );
};
