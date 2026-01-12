export const ALUNOS_EMEBS = {
  INFANTIL: {
    key: 1,
  },
  FUNDAMENTAL: {
    key: 2,
  },
};

export const INFANTIL_EMEBS = {
  key: ALUNOS_EMEBS["INFANTIL"].key,
  label: "Alunos do Infantil (4 a 6 anos)",
};

export const FUNDAMENTAL_EMEBS = {
  key: ALUNOS_EMEBS["FUNDAMENTAL"].key,
  label: "Alunos do Fundamental (acima de 6 anos)",
};

export const STATUS_RELATORIO_FINANCEIRO = {
  RELATORIO_FINANCEIRO_GERADO: "Relatório Financeiro Gerado",
  EM_ANALISE: "Em Análise",
  GERADA_MEDICAO_FINAL: "Gerada Medição Final",
  FINALIZADO: "Finalizado",
};
