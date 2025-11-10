import { usuarioEhEscolaTerceirizadaDiretor } from "src/helpers/utilities";

export const MEDICAO_STATUS_DE_PROGRESSO = {
  MEDICAO_ENVIADA_PELA_UE: {
    nome: usuarioEhEscolaTerceirizadaDiretor()
      ? "Enviado para análise"
      : "Recebido para análise",
  },
  MEDICAO_CORRECAO_SOLICITADA: {
    nome: "Devolvido para ajustes pela DRE",
  },
  MEDICAO_CORRECAO_SOLICITADA_CODAE: {
    nome: "Devolvido para ajustes pela CODAE",
  },
  MEDICAO_CORRIGIDA_PELA_UE: {
    nome: "Corrigido para DRE",
  },
  MEDICAO_CORRIGIDA_PARA_CODAE: {
    nome: "Corrigido para CODAE",
  },
  MEDICAO_APROVADA_PELA_DRE: {
    nome: "Aprovado pela DRE",
  },
  MEDICAO_APROVADA_PELA_CODAE: {
    nome: "Aprovado pela CODAE",
  },
  MEDICAO_EM_ABERTO_PARA_PREENCHIMENTO_UE: {
    nome: "Em aberto para preenchimento pela UE",
  },
  OCORRENCIA_EXCLUIDA_PELA_ESCOLA: {
    nome: "Ocorrência excluída pela escola",
  },
};

export const OCORRENCIA_STATUS_DE_PROGRESSO = {
  MEDICAO_ENVIADA_PELA_UE: {
    nome: "Pendente de Análise",
  },
  MEDICAO_CORRECAO_SOLICITADA: {
    nome: "Devolvido para ajustes pela DRE",
  },
  MEDICAO_CORRECAO_SOLICITADA_CODAE: {
    nome: "Devolvido para ajustes pela CODAE",
  },
  MEDICAO_CORRIGIDA_PELA_UE: {
    nome: "Corrigido para DRE",
  },
  MEDICAO_CORRIGIDA_PARA_CODAE: {
    nome: "Corrigido para CODAE",
  },
  MEDICAO_APROVADA_PELA_DRE: {
    nome: "Aprovado pela DRE",
  },
  MEDICAO_APROVADA_PELA_CODAE: {
    nome: "Aprovado pela CODAE",
  },
  MEDICAO_EM_ABERTO_PARA_PREENCHIMENTO_UE: {
    nome: "Em aberto para preenchimento pela UE",
  },
  OCORRENCIA_EXCLUIDA_PELA_ESCOLA: {
    nome: "Ocorrência excluída pela escola",
  },
};

export const PERIODO_STATUS_DE_PROGRESSO = {
  MEDICAO_ENVIADA_PELA_UE: {
    nome: "Pendente de Análise",
  },
  MEDICAO_CORRECAO_SOLICITADA: {
    nome: "Devolvido para ajustes pela DRE",
  },
  MEDICAO_CORRECAO_SOLICITADA_CODAE: {
    nome: "Devolvido para ajustes pela CODAE",
  },
  MEDICAO_CORRIGIDA_PELA_UE: {
    nome: "Corrigido para DRE",
  },
  MEDICAO_CORRIGIDA_PARA_CODAE: {
    nome: "Corrigido para CODAE",
  },
  MEDICAO_APROVADA_PELA_DRE: {
    nome: "Aprovado pela DRE",
  },
  MEDICAO_APROVADA_PELA_CODAE: {
    nome: "Aprovado pela CODAE",
  },
  MEDICAO_EM_ABERTO_PARA_PREENCHIMENTO_UE: {
    nome: "Em aberto para preenchimento pela UE",
  },
  MEDICAO_SEM_LANCAMENTOS: {
    nome: "Sem Lançamentos",
  },
  OCORRENCIA_EXCLUIDA_PELA_ESCOLA: {
    nome: "Ocorrência excluída pela escola",
  },
};

export const initialStateWeekColumns = [
  { position: 0, dia: "29" },
  { position: 1, dia: "30" },
  { position: 2, dia: "01" },
  { position: 3, dia: "02" },
  { position: 4, dia: "03" },
  { position: 5, dia: "04" },
  { position: 6, dia: "05" },
];

export const diasSemana = [
  "Seg.",
  "Ter.",
  "Qua.",
  "Qui.",
  "Sex.",
  "Sáb.",
  "Dom.",
];
