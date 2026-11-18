export type SelectOption = {
  uuid: string;
  nome: string;
};

export type MultiSelectOption<T = {}> = {
  value: string;
  label: string;
} & T;

export type TabelaAlimentacaoHandle = {
  getTotais: () => {
    totalAtendimentosGeral: number;
    valorTotalGeral: number;
  };
};

export type TabelaDietasHandle = {
  getTotais: () => {
    totalConsumoGeral: number;
    valorTotalGeral: number;
  };
};

export type TipoGrupoFlags = {
  ehCei?: boolean;
  ehEmef: boolean;
  ehCemei: boolean;
  ehEmebs: boolean;
  ehCieja?: boolean;
};

export type LinhaDesconto = {
  chave: string;
  unidades: string[];
  tipoLancamento: string;
  faixaOuAlimentacao: string;
  clausula: string;
  quantidade: number;
  valorUnitario: number;
  total: number;
};

export type ResumoDescontos = {
  tituloFaixaOuAlimentacao: string;
  linhas: LinhaDesconto[];
  total: number;
};
