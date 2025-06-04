import {
  AGUARDANDO_ASSINATURAS,
  AGUARDANDO_DILOG,
  ALTERACOES_APROVADAS,
  ALTERACOES_CODAE,
  ALTERACOES_REPROVADAS,
  ASSINADO_CODAE,
  CRONOGRAMA,
  DILOG,
  ABASTECIMENTO,
  SOLICITACOES_ALTERACOES,
  SOLICITACOES_PENDENTES,
} from "src/configs/constants";

export const CARD_PENDENTES_ASSINATURA = {
  id: "Pendentes de Assinatura",
  titulo: "Pendentes de Assinatura",
  icon: "fa-exclamation-triangle",
  style: "card-pendente-assinatura",
  incluir_status: ["ASSINADO_FORNECEDOR"],
  href: `/${ABASTECIMENTO}/${SOLICITACOES_PENDENTES}`,
};

export const CARD_AGUARDANDO_ASSINATURA = {
  id: "Aguardando Assinatura de DILOG",
  titulo: "Aguardando Assinatura de DILOG",
  icon: "fa-pencil-alt",
  style: "card-aguardando-dilog",
  incluir_status: ["ASSINADO_DILOG_ABASTECIMENTO"],
  href: `/${ABASTECIMENTO}/${AGUARDANDO_DILOG}`,
};

export const CARD_CRONOGRAMAS_ASSINADOS = {
  id: "Cronogramas Assinados",
  titulo: "Cronogramas Assinados",
  icon: "fa-check",
  style: "card-cronogramas-assinados",
  incluir_status: ["ASSINADO_CODAE"],
  href: `/${ASSINADO_CODAE}`,
};

export const CARD_PENDENTES_ASSINATURA_DILOG = {
  id: "Pendentes de Assinatura",
  titulo: "Pendentes de Assinatura",
  icon: "fa-exclamation-triangle",
  style: "card-pendente-assinatura",
  incluir_status: ["ASSINADO_DILOG_ABASTECIMENTO"],
  href: `/${DILOG}/${SOLICITACOES_PENDENTES}`,
};

export const CARD_VISAO_CRONOGRAMA_AGUARDANDO_ASSINATURAS = {
  id: "Aguardando Assinaturas",
  titulo: "Aguardando Assinaturas",
  icon: "fa-exclamation-triangle",
  style: "card-pendente-assinatura",
  incluir_status: [
    "ASSINADO_E_ENVIADO_AO_FORNECEDOR",
    "ASSINADO_FORNECEDOR",
    "ASSINADO_DILOG_ABASTECIMENTO",
  ],
  href: `/${CRONOGRAMA}/${AGUARDANDO_ASSINATURAS}`,
};

export const CARD_SOLICITACOES_ALTERACOES_ABASTECIMENTO = {
  id: "Solicitações de Alterações",
  titulo: "Solicitações de Alterações",
  icon: "fa-exclamation-triangle",
  style: "card-solicitacoes-alteracoes",
  incluir_status: ["CRONOGRAMA_CIENTE"],
  href: `/${ABASTECIMENTO}/${SOLICITACOES_ALTERACOES}`,
};

export const CARD_VISAO_CRONOGRAMA_SOLICITACOES_ALTERACOES_EM_ANALISE = {
  id: "Solicitações de Alterações",
  titulo: "Solicitações de Alterações",
  icon: "fa-exclamation-triangle",
  style: "card-solicitacoes-alteracoes",
  incluir_status: ["EM_ANALISE"],
  href: `/${CRONOGRAMA}/${SOLICITACOES_ALTERACOES}`,
};

export const CARD_SOLICITACOES_APROVADAS_ABASTECIMENTO = {
  id: "Alterações Aprovadas",
  titulo: "Alterações Aprovadas",
  icon: "fa-check",
  style: "card-cronogramas-assinados",
  incluir_status: ["APROVADO_DILOG_ABASTECIMENTO"],
  href: `/${ABASTECIMENTO}/${ALTERACOES_APROVADAS}`,
};

export const CARD_SOLICITACOES_REPROVADAS_ABASTECIMENTO = {
  id: "Alterações Reprovadas",
  titulo: "Alterações Reprovadas",
  icon: "fa-times-circle",
  style: "card-solicitacoes-reprovadas",
  incluir_status: ["REPROVADO_DILOG_ABASTECIMENTO"],
  href: `/${ABASTECIMENTO}/${ALTERACOES_REPROVADAS}`,
};

export const CARD_SOLICITACOES_ALTERACOES_DILOG = {
  id: "Solicitações de Alterações",
  titulo: "Solicitações de Alterações",
  icon: "fa-exclamation-triangle",
  style: "card-solicitacoes-alteracoes",
  incluir_status: [
    "APROVADO_DILOG_ABASTECIMENTO",
    "REPROVADO_DILOG_ABASTECIMENTO",
  ],
  href: `/${DILOG}/${SOLICITACOES_ALTERACOES}`,
};

export const CARD_SOLICITACOES_APROVADAS_DILOG = {
  id: "Alterações Aprovadas",
  titulo: "Alterações Aprovadas",
  icon: "fa-check",
  style: "card-cronogramas-assinados",
  incluir_status: ["APROVADO_DILOG"],
  href: `/${DILOG}/${ALTERACOES_APROVADAS}`,
};

export const CARD_SOLICITACOES_REPROVADAS_DILOG = {
  id: "Alterações Reprovadas",
  titulo: "Alterações Reprovadas",
  icon: "fa-times-circle",
  style: "card-solicitacoes-reprovadas",
  incluir_status: ["REPROVADO_DILOG"],
  href: `/${DILOG}/${ALTERACOES_REPROVADAS}`,
};

export const CARD_SOLICITACOES_ALTERACOES_CODAE = {
  id: "Alterações CODAE",
  titulo: "Alterações CODAE",
  icon: "fa-info-circle",
  style: "card-alteracoes-codae",
  incluir_status: ["ALTERACAO_ENVIADA_FORNECEDOR", "FORNECEDOR_CIENTE"],
  href: `/${CRONOGRAMA}/${ALTERACOES_CODAE}`,
};

export const cards_abastecimento = [
  CARD_PENDENTES_ASSINATURA,
  CARD_AGUARDANDO_ASSINATURA,
  CARD_CRONOGRAMAS_ASSINADOS,
];

export const cards_dilog = [
  CARD_PENDENTES_ASSINATURA_DILOG,
  CARD_CRONOGRAMAS_ASSINADOS,
];

export const cards_visao_cronograma = [
  CARD_VISAO_CRONOGRAMA_AGUARDANDO_ASSINATURAS,
  CARD_CRONOGRAMAS_ASSINADOS,
];

export const cards_alteracao_abastecimento = [
  CARD_SOLICITACOES_ALTERACOES_ABASTECIMENTO,
  CARD_SOLICITACOES_APROVADAS_ABASTECIMENTO,
  CARD_SOLICITACOES_REPROVADAS_ABASTECIMENTO,
  CARD_SOLICITACOES_ALTERACOES_CODAE,
];

export const cards_alteracao_dilog = [
  CARD_SOLICITACOES_ALTERACOES_DILOG,
  CARD_SOLICITACOES_APROVADAS_DILOG,
  CARD_SOLICITACOES_REPROVADAS_DILOG,
  CARD_SOLICITACOES_ALTERACOES_CODAE,
];

export const cards_alteracao_visao_cronograma = [
  CARD_VISAO_CRONOGRAMA_SOLICITACOES_ALTERACOES_EM_ANALISE,
  CARD_SOLICITACOES_APROVADAS_DILOG,
  CARD_SOLICITACOES_REPROVADAS_DILOG,
  CARD_SOLICITACOES_ALTERACOES_CODAE,
];
