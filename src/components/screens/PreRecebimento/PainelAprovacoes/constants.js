import {
  AGUARDANDO_DILOG,
  ALTERACOES_APROVADAS,
  ALTERACOES_REPROVADAS,
  ASSINADO_CODAE,
  DILOG,
  DINUTRE,
  SOLICITACOES_ALTERACOES,
  SOLICITACOES_PENDENTES
} from "configs/constants";

export const CARD_PENDENTES_ASSINATURA = {
  id: "Pendentes de Assinatura",
  titulo: "Pendentes de Assinatura",
  icon: "fa-exclamation-triangle",
  style: "card-pendente-assinatura",
  incluir_status: ["ASSINADO_FORNECEDOR"],
  href: `/${DINUTRE}/${SOLICITACOES_PENDENTES}`
};

export const CARD_AGUARDANDO_ASSINATURA = {
  id: "Aguardando Assinatura de DILOG",
  titulo: "Aguardando Assinatura de DILOG",
  icon: "fa-pencil-alt",
  style: "card-aguardando-dilog",
  incluir_status: ["ASSINADO_DINUTRE"],
  href: `/${DINUTRE}/${AGUARDANDO_DILOG}`
};

export const CARD_CRONOGRAMAS_ASSINADOS = {
  id: "Cronogramas Assinados",
  titulo: "Cronogramas Assinados",
  icon: "fa-check",
  style: "card-cronogramas-assinados",
  incluir_status: ["ASSINADO_CODAE"],
  href: `/${DINUTRE}/${ASSINADO_CODAE}`
};

export const CARD_PENDENTES_ASSINATURA_DILOG = {
  id: "Pendentes de Assinatura",
  titulo: "Pendentes de Assinatura",
  icon: "fa-exclamation-triangle",
  style: "card-pendente-assinatura",
  incluir_status: ["ASSINADO_DINUTRE"],
  href: `/${DINUTRE}/${SOLICITACOES_PENDENTES}`
};

export const CARD_VISAO_CRONOGRAMA_AGUARDANDO_ASSINATURAS = {
  id: "Aguardando Assinaturas",
  titulo: "Aguardando Assinaturas",
  icon: "fa-exclamation-triangle",
  style: "card-pendente-assinatura",
  incluir_status: [
    "ASSINADO_E_ENVIADO_AO_FORNECEDOR",
    "ASSINADO_FORNECEDOR",
    "ASSINADO_DINUTRE"
  ],
  href: `#`
};

export const CARD_SOLICITACOES_ALTERACOES_DINUTRE = {
  id: "Solicitações de Alterações",
  titulo: "Solicitações de Alterações",
  icon: "fa-exclamation-triangle",
  style: "card-solicitacoes-alteracoes",
  incluir_status: ["CRONOGRAMA_CIENTE"],
  href: `/${DINUTRE}/${SOLICITACOES_ALTERACOES}`
};

export const CARD_VISAO_CRONOGRAMA_SOLICITACOES_ALTERACOES_EM_ANALISE = {
  id: "Solicitações de Alterações",
  titulo: "Solicitações de Alterações",
  icon: "fa-exclamation-triangle",
  style: "card-solicitacoes-alteracoes",
  incluir_status: ["EM_ANALISE"],
  href: `#`
};

export const CARD_SOLICITACOES_APROVADAS_DINUTRE = {
  id: "Alterações Aprovadas",
  titulo: "Alterações Aprovadas",
  icon: "fa-check",
  style: "card-cronogramas-assinados",
  incluir_status: ["APROVADO_DINUTRE"],
  href: `/${DINUTRE}/${ALTERACOES_APROVADAS}`
};

export const CARD_SOLICITACOES_REPROVADAS_DINUTRE = {
  id: "Alterações Reprovadas",
  titulo: "Alterações Reprovadas",
  icon: "fa-times-circle",
  style: "card-solicitacoes-reprovadas",
  incluir_status: ["REPROVADO_DINUTRE"],
  href: `/${DINUTRE}/${ALTERACOES_REPROVADAS}`
};

export const CARD_SOLICITACOES_ALTERACOES_DILOG = {
  id: "Solicitações de Alterações",
  titulo: "Solicitações de Alterações",
  icon: "fa-exclamation-triangle",
  style: "card-solicitacoes-alteracoes",
  incluir_status: ["APROVADO_DINUTRE", "REPROVADO_DINUTRE"],
  href: `/${DILOG}/${SOLICITACOES_ALTERACOES}`
};

export const CARD_SOLICITACOES_APROVADAS_DILOG = {
  id: "Alterações Aprovadas",
  titulo: "Alterações Aprovadas",
  icon: "fa-check",
  style: "card-cronogramas-assinados",
  incluir_status: ["APROVADO_DILOG"],
  href: `/${DILOG}/${ALTERACOES_APROVADAS}`
};

export const CARD_SOLICITACOES_REPROVADAS_DILOG = {
  id: "Alterações Reprovadas",
  titulo: "Alterações Reprovadas",
  icon: "fa-times-circle",
  style: "card-solicitacoes-reprovadas",
  incluir_status: ["REPROVADO_DILOG"],
  href: `/${DILOG}/${ALTERACOES_REPROVADAS}`
};

export const cards_dinutre = [
  CARD_PENDENTES_ASSINATURA,
  CARD_AGUARDANDO_ASSINATURA,
  CARD_CRONOGRAMAS_ASSINADOS
];

export const cards_dilog = [
  CARD_PENDENTES_ASSINATURA_DILOG,
  CARD_CRONOGRAMAS_ASSINADOS
];

export const cards_visao_cronograma = [
  CARD_VISAO_CRONOGRAMA_AGUARDANDO_ASSINATURAS,
  CARD_CRONOGRAMAS_ASSINADOS
];

export const cards_alteracao_dinutre = [
  CARD_SOLICITACOES_ALTERACOES_DINUTRE,
  CARD_SOLICITACOES_APROVADAS_DINUTRE,
  CARD_SOLICITACOES_REPROVADAS_DINUTRE
];

export const cards_alteracao_dilog = [
  CARD_SOLICITACOES_ALTERACOES_DILOG,
  CARD_SOLICITACOES_APROVADAS_DILOG,
  CARD_SOLICITACOES_REPROVADAS_DILOG
];

export const cards_alteracao_visao_cronograma = [
  CARD_VISAO_CRONOGRAMA_SOLICITACOES_ALTERACOES_EM_ANALISE,
  CARD_SOLICITACOES_APROVADAS_DILOG,
  CARD_SOLICITACOES_REPROVADAS_DILOG
];
