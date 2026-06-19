export interface LoteInterface {
  uuid: string;
  nome: string;
  diretoria_regional: {
    iniciais: string;
  };
}

export interface TipoUnidadeEscolarInterface {
  uuid: string;
  iniciais: string;
}

export interface UnidadeEducacionalInterface {
  uuid: string;
  codigo_eol: string;
  codigo_eol_escola: string;
  tipo_gestao: string;
}

export interface FiltroUnidadesEducacionaisInterface {
  lotes: string[];
  tipos_unidades: string[];
}

export interface OpcaoMultiselectInterface {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface RecorrenciaInterface {
  data_inicial: string;
  data_final: string;
  periodos_escolares: string[];
  dias_semana: string[];
}

export interface DiasLetivosFormInterface {
  recorrencias: RecorrenciaInterface[];
  lotes: string[];
  tipos_unidades: string[];
  unidades_educacionais: string[];
}

export interface TipoAlimentacaoInterface {
  nome: string;
  uuid: string;
  posicao: number;
}

export interface PeriodoEscolarInterface {
  nome: string;
  uuid: string;
  posicao: number | null;
  tipo_turno: number | null;
  possui_alunos_regulares: boolean | null;
  tipos_alimentacao: TipoAlimentacaoInterface[];
}

export interface PeriodosEscolaresResponseInterface {
  count: number;
  next: string | null;
  previous: string | null;
  results: PeriodoEscolarInterface[];
}
