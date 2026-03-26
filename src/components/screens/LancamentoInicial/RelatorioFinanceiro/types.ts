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
