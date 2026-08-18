export type IFiltros = {
  mes?: string;
  lotes?: Array<string> | undefined;
  tipos_unidades?: Array<string> | undefined;
  unidade_educacional?: Array<string> | undefined;
  periodos?: Array<string> | undefined;
  tipos_alimentacao?: Array<string> | undefined;
  periodo_lancamento_de?: string;
  periodo_lancamento_ate?: string;
};
