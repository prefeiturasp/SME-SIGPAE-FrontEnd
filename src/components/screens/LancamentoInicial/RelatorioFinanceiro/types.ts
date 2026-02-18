export type SelectOption = {
  uuid: string;
  nome: string;
};

export type MultiSelectOption = {
  value: string;
  label: string;
};

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
