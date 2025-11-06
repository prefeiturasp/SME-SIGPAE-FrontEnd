export interface ParametrizacaoFinanceiraPayload {
  edital: string;
  lote: string;
  grupo_unidade_escolar: string;
  data_inicial: string;
  data_final?: string;
  legenda: string;
}

export interface ParametrizacaoFinanceiraParams {
  edital?: string;
  lote?: string;
  tipos_unidades?: Array<string>;
}

export interface ParametrizacaoFinanceiraResponse {
  next: string | null;
  previous: string | null;
  count: number;
  page_size: number;
  results: ParametrizacaoFinanceiraInterface[];
}

export interface ParametrizacaoFinanceiraInterface {
  uuid?: string;
  edital: Edital;
  dre: string;
  lote: Lote;
  grupo_unidade_escolar: GrupoUnidadeEscolar;
  data_inicial: string;
  data_final: string;
  legenda: string;
}

type Edital = {
  uuid: string;
  numero: string;
};

type Lote = {
  uuid: string;
  nome: string;
};

export type TipoUnidade = {
  uuid: string;
  iniciais: string;
};

export type GrupoUnidadeEscolar = {
  uuid: string;
  nome: string;
  tipos_unidades: TipoUnidade[];
};
