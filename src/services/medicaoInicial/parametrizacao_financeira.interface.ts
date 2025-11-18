export type ValorLinha = {
  faixa_etaria?: string;
  tipo_alimentacao?: string;
  valor_unitario_reajuste: string;
  valor_unitario: string;
  percentual_acrescimo: string;
};

export type FaixaEtaria = {
  __str__: string;
  uuid: string;
  inicio: number;
  fim: number;
};

export type ValorTabela = {
  nome_campo: string;
  tipo_valor: string;
  faixa_etaria?: FaixaEtaria;
  tipo_alimentacao?: string;
  valor?: string;
};

export type TabelaParametrizacao = {
  nome: string;
  periodo_escolar: string;
  valores: ValorTabela[];
};

export interface ParametrizacaoFinanceiraPayload {
  edital: string;
  lote: string;
  grupo_unidade_escolar: string;
  data_inicial: string;
  data_final?: string;
  legenda: string;
  tabelas?: TabelaParametrizacao[] | object;
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
  tabelas?: TabelaParametrizacao[];
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

export type CampoValor = "valor_unitario" | "valor_unitario_reajuste";
