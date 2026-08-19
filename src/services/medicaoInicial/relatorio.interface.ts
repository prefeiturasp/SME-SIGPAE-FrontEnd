type RelatorioAdesaoTotalAlimentacao = {
  [key: string]: {
    total_servido: number;
    total_frequencia: number;
    total_adesao: number;
  };
};

type RelatorioAdesaoPeriodo = {
  [key: string]: RelatorioAdesaoTotalAlimentacao;
};

export interface RelatorioAdesaoParams {
  mes_ano: string;
  lotes: Array<string>;
  tipos_unidades: Array<string>;
  escola__uuid: Array<string>;
  periodos_escolares: Array<string>;
  tipos_alimentacao: Array<string>;
  periodo_lancamento_de?: string;
  periodo_lancamento_ate?: string;
  page?: number;
}

export interface RelatorioAdesaoEscola {
  nome: string;
  codigo_eol: string;
}

export interface RelatorioAdesaoEscolaResultado {
  escola: RelatorioAdesaoEscola;
  resultados: RelatorioAdesaoPeriodo;
}

export interface RelatorioAdesaoPaginadoResponse {
  next: string | null;
  previous: string | null;
  count: number;
  page_size: number;
  results: Array<RelatorioAdesaoEscolaResultado>;
}

export interface RelatorioAdesaoResponse extends RelatorioAdesaoPeriodo {}
export interface RelatorioAdesaoExportResponse {
  data: Object;
  status: number;
}
