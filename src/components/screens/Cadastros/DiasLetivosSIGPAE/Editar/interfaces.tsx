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
  codigo_eol_escola: string;
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
