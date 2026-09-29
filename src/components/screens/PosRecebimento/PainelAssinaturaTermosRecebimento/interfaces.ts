export interface TermoRecebimentoAssinaturaDashboard {
  uuid: string;
  empresa: string;
  numero_contrato?: string;
  numeros_cronogramas?: string[];
  nomes_produtos?: string[];
  criado_em: string;
}

export interface FiltrosPainelAssinaturaTermos {
  numero_contrato?: string;
  nome_produto?: string;
  nome_empresa?: string;
}
