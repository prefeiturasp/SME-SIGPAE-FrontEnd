export type SelectOption = {
  uuid: string;
  nome: string;
};

export type MultiSelectOption = {
  value: string;
  label: string;
};

export type TabelaAlimentacaoCEIHandle = {
  getTotais: () => {
    totalAtendimentosGeral: number;
    valorTotalGeral: number;
  };
};

export type TabelaDietasCEIHandle = {
  getTotais: () => {
    totalConsumoGeral: number;
    valorTotalGeral: number;
  };
};
