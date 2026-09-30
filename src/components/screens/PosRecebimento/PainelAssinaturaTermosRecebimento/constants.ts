import {
  POS_RECEBIMENTO,
  PAINEL_ASSINATURA_TERMOS_RECEBIMENTO,
  PENDENTES_ASSINATURA_TERMOS,
  ASSINADOS_TERMOS,
} from "src/configs/constants";

export interface CardPainelAssinatura {
  id: string;
  titulo: string;
  icon: string;
  style: string;
  href: string;
}

export const CARD_PENDENTES_ASSINATURA: CardPainelAssinatura = {
  id: "pendentes",
  titulo: "Pendentes de Assinatura",
  icon: "fa-exclamation-triangle",
  style: "card-pendente-assinatura",
  href: `/${POS_RECEBIMENTO}/${PAINEL_ASSINATURA_TERMOS_RECEBIMENTO}/${PENDENTES_ASSINATURA_TERMOS}/`,
};

export const CARD_ASSINADOS: CardPainelAssinatura = {
  id: "assinados",
  titulo: "Assinados",
  icon: "fa-check",
  style: "card-cronogramas-assinados",
  href: `/${POS_RECEBIMENTO}/${PAINEL_ASSINATURA_TERMOS_RECEBIMENTO}/${ASSINADOS_TERMOS}/`,
};
