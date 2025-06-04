import React from "react";

import {
  PAINEL_LAYOUT_EMBALAGEM,
  PRE_RECEBIMENTO,
  DETALHAR_LAYOUT_EMBALAGEM,
  ANALISAR_LAYOUT_EMBALAGEM,
} from "src/configs/constants";
import { usuarioPodeAnalisarLayoutEmbalagem } from "src/helpers/utilities";
import { getDashboardLayoutEmbalagem } from "src/services/layoutEmbalagem.service";
import Page from "src/components/Shareable/Page/Page";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import { SolicitacoesLayoutStatusGenerico } from "src/components/screens/SolicitacoesLayoutStatusGenerico";
import { CARD_APROVADOS } from "src/components/screens/PreRecebimento/PainelLayoutEmbalagem/constants";

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
