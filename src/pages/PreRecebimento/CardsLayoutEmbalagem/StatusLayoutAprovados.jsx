import React from "react";
import Page from "components/Shareable/Page/Page";
import Breadcrumb from "components/Shareable/Breadcrumb";
import { PAINEL_LAYOUT_EMBALAGEM, PRE_RECEBIMENTO } from "configs/constants";
import { getDashboardLayoutEmbalagem } from "services/layoutEmbalagem.service";
import { SolicitacoesLayoutStatusGenerico } from "components/screens/SolicitacoesLayoutStatusGenerico";
import { CARD_APROVADOS } from "../../../components/screens/PreRecebimento/PainelLayoutEmbalagem/constants";
import { DETALHAR_LAYOUT_EMBALAGEM } from "../../../configs/constants";

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
        urlBaseItem={`/${PRE_RECEBIMENTO}/${DETALHAR_LAYOUT_EMBALAGEM}`}
      />
    </Page>
  );
};
