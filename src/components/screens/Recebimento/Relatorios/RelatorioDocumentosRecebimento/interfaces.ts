export interface FiltrosRelatorioDocRecebimento {
  empresa?: string[];
  nome_produto?: string;
  numero?: string;
  status?: string;
  data_inicial?: string;
  data_final?: string;
  situacao?: string[];
}

export interface EmpresaFiltros {
  uuid: string;
  nome_fantasia: string;
}

export interface DataFabricacaoEPrazo {
  uuid: string;
  data_fabricacao: string;
  data_validade: string;
  data_maxima_recebimento: string;
  prazo_maximo_recebimento: string;
  justificativa: string;
}

export interface DocumentoRecebimento {
  uuid: string;
  numero_laudo: string;
  nome_laboratorio: string;
  numero_lote_laudo: string;
  data_final_lote: string;
  unidade_medida: string;
  quantidade_laudo: string;
  saldo_inicial_laudo: string;
  saldo_atual: string;
  datas_fabricacao_e_prazos: DataFabricacaoEPrazo[];
  status_documento: string;
}

export interface DocsRecebimentoRelatorio {
  uuid: string;
  numero_cronograma: string;
  produto: string;
  empresa: string;
  numero_pregao_chamada_publica: string;
  numero_processo_sei: string;
  documentos: DocumentoRecebimento[];
}
