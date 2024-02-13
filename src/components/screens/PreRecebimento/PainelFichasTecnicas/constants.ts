import {
  CardConfig,
  FichaTecnicaDashboard,
} from "interfaces/pre_recebimento.interface";

import {
  PAINEL_FICHAS_TECNICAS,
  PENDENTES_APROVACAO,
  PRE_RECEBIMENTO,
  ENVIADOS_PARA_CORRECAO,
} from "../../../../configs/constants";

export const CARD_PENDENTES_APROVACAO: CardConfig<FichaTecnicaDashboard> = {
  id: "Pendentes de Aprovação",
  titulo: "Pendentes de Aprovação",
  icon: "fa-exclamation-triangle",
  style: "card-pendente-assinatura",
  incluir_status: ["ENVIADA_PARA_ANALISE"],
  href: `/${PRE_RECEBIMENTO}/${PAINEL_FICHAS_TECNICAS}/${PENDENTES_APROVACAO}`,
};

export const CARD_ENVIADOS_PARA_CORRECAO: CardConfig<FichaTecnicaDashboard> = {
  id: "Enviados para Correção",
  titulo: "Enviados para Correção",
  icon: "fa-pencil-alt",
  style: "card-solicitacoes-reprovadas",
  incluir_status: ["ENVIADA_PARA_CORRECAO"],
  href: `/${PRE_RECEBIMENTO}/${PAINEL_FICHAS_TECNICAS}/${ENVIADOS_PARA_CORRECAO}`,
};

export const cardsPainel = [
  CARD_PENDENTES_APROVACAO,
  CARD_ENVIADOS_PARA_CORRECAO,
];
