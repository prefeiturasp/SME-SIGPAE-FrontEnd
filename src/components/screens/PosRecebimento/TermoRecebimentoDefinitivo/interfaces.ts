export interface TermoRecebimentoListagem {
  uuid: string;
  numero_contrato: string;
  nome_empresa: string;
  data_cadastro: string;
  status: string;
  status_display?: string;
}

export interface FiltrosTermoRecebimento {
  nome_produto?: string;
  numero_contrato?: string;
  nome_empresa?: string;
  data_cadastro?: string;
  status?: string;
}
