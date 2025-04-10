import { CARD_ENVIADOS_PARA_CORRECAO } from "components/screens/PreRecebimento/PainelLayoutEmbalagem/constants";
import { SolicitacoesLayoutStatusGenerico } from "components/screens/SolicitacoesLayoutStatusGenerico";
import Breadcrumb from "components/Shareable/Breadcrumb";
import Page from "components/Shareable/Page/Page";
import {
  DETALHAR_LAYOUT_EMBALAGEM,
  DETALHAR_LAYOUT_EMBALAGEM_SOLICITACAO_ALTERACAO,
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
  href: CARD_ENVIADOS_PARA_CORRECAO.href,
  titulo: CARD_ENVIADOS_PARA_CORRECAO.titulo,
};

const limit = 10;

const paramsDefault = {
  status: CARD_ENVIADOS_PARA_CORRECAO.incluir_status,
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
    return `/${PRE_RECEBIMENTO}/${DETALHAR_LAYOUT_EMBALAGEM_SOLICITACAO_ALTERACAO}`;
  };

  return (
    <Page
      titulo={atual.titulo}
      botaoVoltar
      voltarPara={`/${PRE_RECEBIMENTO}/${PAINEL_LAYOUT_EMBALAGEM}`}
    >
      <Breadcrumb home="/" atual={atual} anteriores={anteriores} />
      <SolicitacoesLayoutStatusGenerico
        icone={CARD_ENVIADOS_PARA_CORRECAO.icon}
        titulo={CARD_ENVIADOS_PARA_CORRECAO.titulo}
        cardType={CARD_ENVIADOS_PARA_CORRECAO.style}
        getSolicitacoes={getDashboardLayoutEmbalagem}
        params={paramsDefault}
        limit={limit}
        urlBaseItem={getURLBaseItem()}
      />
    </Page>
  );
};
