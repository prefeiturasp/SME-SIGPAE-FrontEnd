import {
  CardConfig,
  DocumentosRecebimentoDashboard,
} from "src/interfaces/pre_recebimento.interface";

import {
  PENDENTES_APROVACAO,
  APROVADOS,
  ENVIADOS_PARA_CORRECAO,
} from "../../../../configs/constants";

export const CARD_PENDENTES_APROVACAO: CardConfig<DocumentosRecebimentoDashboard> =
  {
    id: "Pendentes de Aprovação",
    titulo: "Pendentes de Aprovação",
    icon: "fa-exclamation-triangle",
    style: "card-pendente-assinatura",
    incluir_status: ["ENVIADO_PARA_ANALISE"],
    href: `${PENDENTES_APROVACAO}`,
  };

export const CARD_APROVADOS: CardConfig<DocumentosRecebimentoDashboard> = {
  id: "Aprovados",
  titulo: "Aprovados",
  icon: "fa-check",
  style: "card-cronogramas-assinados",
  incluir_status: ["APROVADO"],
  href: `${APROVADOS}`,
};

export const CARD_ENVIADOS_PARA_CORRECAO: CardConfig<DocumentosRecebimentoDashboard> =
  {
    id: "Enviados para Correção",
    titulo: "Enviados para Correção",
    icon: "fa-pencil-alt",
    style: "card-solicitacoes-reprovadas",
    incluir_status: ["ENVIADO_PARA_CORRECAO"],
    href: `${ENVIADOS_PARA_CORRECAO}`,
  };

export const cardsPainel = [
  CARD_PENDENTES_APROVACAO,
  CARD_APROVADOS,
  CARD_ENVIADOS_PARA_CORRECAO,
];
