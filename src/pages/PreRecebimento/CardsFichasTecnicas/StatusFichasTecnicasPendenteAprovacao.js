import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Page from "src/components/Shareable/Page/Page";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import { PAINEL_FICHAS_TECNICAS, PRE_RECEBIMENTO } from "src/configs/constants";
import { CARD_PENDENTES_APROVACAO } from "src/components/screens/PreRecebimento/PainelFichasTecnicas/constants";
import { getDashboardFichasTecnicasPorStatus } from "src/services/fichaTecnica.service";
import { SolicitacoesFichaTecnicaStatusGenerico } from "src/components/screens/SolicitacoesFichaTecnicaStatusGenerico";
import { gerarLinkItemFichaTecnica } from "src/components/screens/PreRecebimento/PainelFichasTecnicas/helpers";
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
      href: `/${PRE_RECEBIMENTO}/${PAINEL_FICHAS_TECNICAS}`,
      titulo: "Fichas Técnicas",
    },
  ];
  return _jsxs(Page, {
    titulo: atual.titulo,
    botaoVoltar: true,
    voltarPara: `/${PRE_RECEBIMENTO}/${PAINEL_FICHAS_TECNICAS}`,
    children: [
      _jsx(Breadcrumb, { home: "/", atual: atual, anteriores: anteriores }),
      _jsx(SolicitacoesFichaTecnicaStatusGenerico, {
        icone: CARD_PENDENTES_APROVACAO.icon,
        titulo: CARD_PENDENTES_APROVACAO.titulo,
        cardType: CARD_PENDENTES_APROVACAO.style,
        getSolicitacoes: getDashboardFichasTecnicasPorStatus,
        params: paramsDefault,
        limit: limit,
        urlBaseItem: gerarLinkItemFichaTecnica({
          item: { status: "Enviada para Análise" },
        }),
      }),
    ],
  });
};
