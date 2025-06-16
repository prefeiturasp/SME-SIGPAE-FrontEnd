import React from "react";
import Page from "src/components/Shareable/Page/Page";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import {
  PAINEL_DOCUMENTOS_RECEBIMENTO,
  PRE_RECEBIMENTO,
  DETALHAR_CODAE_DOCUMENTO_RECEBIMENTO,
} from "src/configs/constants";
import { getDashboardDocumentosRecebimentoPorStatus } from "src/services/documentosRecebimento.service";
import { SolicitacoesDocumentoStatusGenerico } from "src/components/screens/SolicitacoesDocumentoStatusGenerico";
import { CARD_ENVIADOS_PARA_CORRECAO } from "../../../components/screens/PreRecebimento/PainelDocumentosRecebimento/constants";

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
      href: `/${PRE_RECEBIMENTO}/${PAINEL_DOCUMENTOS_RECEBIMENTO}`,
      titulo: "Documentos de Recebimento",
    },
  ];

  return (
    <Page
      titulo={atual.titulo}
      botaoVoltar
      voltarPara={`/${PRE_RECEBIMENTO}/${PAINEL_DOCUMENTOS_RECEBIMENTO}`}
    >
      <Breadcrumb home="/" atual={atual} anteriores={anteriores} />
      <SolicitacoesDocumentoStatusGenerico
        icone={CARD_ENVIADOS_PARA_CORRECAO.icon}
        titulo={CARD_ENVIADOS_PARA_CORRECAO.titulo}
        cardType={CARD_ENVIADOS_PARA_CORRECAO.style}
        getSolicitacoes={getDashboardDocumentosRecebimentoPorStatus}
        params={paramsDefault}
        limit={limit}
        urlBaseItem={`/${PRE_RECEBIMENTO}/${DETALHAR_CODAE_DOCUMENTO_RECEBIMENTO}`}
      />
    </Page>
  );
};
