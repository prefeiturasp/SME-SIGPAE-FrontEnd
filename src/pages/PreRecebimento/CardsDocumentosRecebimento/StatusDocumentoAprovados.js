import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Page from "src/components/Shareable/Page/Page";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import {
  PAINEL_DOCUMENTOS_RECEBIMENTO,
  PRE_RECEBIMENTO,
  DETALHAR_CODAE_DOCUMENTO_RECEBIMENTO,
} from "src/configs/constants";
import { getDashboardDocumentosRecebimentoPorStatus } from "src/services/documentosRecebimento.service";
import { SolicitacoesDocumentoStatusGenerico } from "src/components/screens/SolicitacoesDocumentoStatusGenerico";
import { CARD_APROVADOS } from "../../../components/screens/PreRecebimento/PainelDocumentosRecebimento/constants";
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
      href: `/${PRE_RECEBIMENTO}/${PAINEL_DOCUMENTOS_RECEBIMENTO}`,
      titulo: "Documentos de Recebimento",
    },
  ];
  return _jsxs(Page, {
    titulo: atual.titulo,
    botaoVoltar: true,
    voltarPara: `/${PRE_RECEBIMENTO}/${PAINEL_DOCUMENTOS_RECEBIMENTO}`,
    children: [
      _jsx(Breadcrumb, { home: "/", atual: atual, anteriores: anteriores }),
      _jsx(SolicitacoesDocumentoStatusGenerico, {
        icone: CARD_APROVADOS.icon,
        titulo: CARD_APROVADOS.titulo,
        cardType: CARD_APROVADOS.style,
        getSolicitacoes: getDashboardDocumentosRecebimentoPorStatus,
        params: paramsDefault,
        limit: limit,
        urlBaseItem: `/${PRE_RECEBIMENTO}/${DETALHAR_CODAE_DOCUMENTO_RECEBIMENTO}`,
      }),
    ],
  });
};
