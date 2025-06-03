import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Page from "src/components/Shareable/Page/Page";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import {
  PAINEL_DOCUMENTOS_RECEBIMENTO,
  PRE_RECEBIMENTO,
  ANALISAR_DOCUMENTO_RECEBIMENTO,
  DETALHAR_FORNECEDOR_DOCUMENTO_RECEBIMENTO,
} from "src/configs/constants";
import { usuarioEhDilogQualidade } from "src/helpers/utilities";
import { getDashboardDocumentosRecebimentoPorStatus } from "src/services/documentosRecebimento.service";
import { SolicitacoesDocumentoStatusGenerico } from "src/components/screens/SolicitacoesDocumentoStatusGenerico";
import { CARD_PENDENTES_APROVACAO } from "../../../components/screens/PreRecebimento/PainelDocumentosRecebimento/constants";
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
      href: `/${PRE_RECEBIMENTO}/${PAINEL_DOCUMENTOS_RECEBIMENTO}`,
      titulo: "Documentos de Recebimento",
    },
  ];
  const urlBaseItem = usuarioEhDilogQualidade()
    ? `/${PRE_RECEBIMENTO}/${ANALISAR_DOCUMENTO_RECEBIMENTO}`
    : `/${PRE_RECEBIMENTO}/${DETALHAR_FORNECEDOR_DOCUMENTO_RECEBIMENTO}`;
  return _jsxs(Page, {
    titulo: atual.titulo,
    botaoVoltar: true,
    voltarPara: `/${PRE_RECEBIMENTO}/${PAINEL_DOCUMENTOS_RECEBIMENTO}`,
    children: [
      _jsx(Breadcrumb, { home: "/", atual: atual, anteriores: anteriores }),
      _jsx(SolicitacoesDocumentoStatusGenerico, {
        icone: CARD_PENDENTES_APROVACAO.icon,
        titulo: CARD_PENDENTES_APROVACAO.titulo,
        cardType: CARD_PENDENTES_APROVACAO.style,
        getSolicitacoes: getDashboardDocumentosRecebimentoPorStatus,
        params: paramsDefault,
        limit: limit,
        urlBaseItem: urlBaseItem,
      }),
    ],
  });
};
