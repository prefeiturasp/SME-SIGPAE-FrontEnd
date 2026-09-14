export interface FiltrosRelatorioCronograma {
  empresa?: string[];
  nome_produto?: string;
  numero_cronograma_mensal?: string;
  numero_cronograma_semanal?: string;
  status?: string[];
  mes_inicial?: string;
  mes_final?: string;
}

export interface EmpresaFiltros {
  uuid: string;
  nome_fantasia: string;
}

export interface ProgramacoesCronogramaSemanal {
  quantidade: number;
  data_inicio: string;
  data_fim: string;
  mes_programado: string;
}

export interface CronogramaSemanalRelatorio {
  numero: string;
  empresa: string;
  produto: string;
  qtd_total_empenho: number;
  unidade_medida: string;
  status: string;
  custo_unitario_produto: number;
  programacoes: ProgramacoesCronogramaSemanal[];
}
