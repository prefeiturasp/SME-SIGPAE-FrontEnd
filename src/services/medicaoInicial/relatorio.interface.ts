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
  diretoria_regional: string;
  lotes: Array<string>;
  escola: string;
  periodos_escolares: Array<string>;
  tipos_alimentacao: Array<string>;
  periodo_lancamento_de?: string;
  periodo_lancamento_ate?: string;
}

export interface RelatorioAdesaoResponse extends RelatorioAdesaoPeriodo {}
export interface RelatorioAdesaoExportResponse {
  detail: string;
}
