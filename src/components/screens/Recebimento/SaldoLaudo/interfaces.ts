export interface AjusteSaldoLaudoListagem {
  uuid: string;
  numero_cronograma: string;
  produto: string;
  fornecedor: string;
  numero_laudo: string;
  quantidade_descontada: number;
  unidade_medida: string;
}

export interface AjusteSaldoLaudoDetalhar {
  uuid: string;
  numero_cronograma: string;
  numero_laudo: string;
  unidade_medida: string;
  quantidade_descontada: number;
}
