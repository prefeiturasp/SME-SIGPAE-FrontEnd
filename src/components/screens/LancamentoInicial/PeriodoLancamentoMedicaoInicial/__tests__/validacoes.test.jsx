import {
  exibirTooltipQtdKitLancheDiferenteSolAlimentacoesAutorizadas,
  exibirTooltipQtdKitLancheMaiorSolAlimentacoesAutorizadas,
  exibirTooltipQtdKitLancheMenorSolAlimentacoesAutorizadas,
} from "../validacoes";

describe("Funções de Tooltip Kit Lanche", () => {
  const baseParams = {
    formValuesAtualizados: {},
    row: { name: "kit_lanche" },
    column: { dia: 1 },
    categoria: {
      id: 1,
      nome: "SOLICITAÇÕES KIT LANCHE",
    },
    kitLanchesAutorizadas: [
      { dia: 1, numero_alunos: "5" },
      { dia: 1, numero_alunos: "3" },
    ],
    value_: "10",
    ehChangeInput: false,
  };

  describe("exibirTooltipQtdKitLancheDiferenteSolAlimentacoesAutorizadas", () => {
    it("deve retornar true quando soma for diferente do valor e observações vazias", () => {
      const params = {
        ...baseParams,
        formValuesAtualizados: {
          kit_lanche__dia_1__categoria_1: "10",
          observacoes__dia_1__categoria_1: "",
        },
      };

      const result =
        exibirTooltipQtdKitLancheDiferenteSolAlimentacoesAutorizadas(
          params.formValuesAtualizados,
          params.row,
          params.column,
          params.categoria,
          params.kitLanchesAutorizadas,
          params.value_,
          params.ehChangeInput,
        );

      expect(result).toBe(true); // 8 !== 10
    });

    it("deve retornar false quando soma for igual ao valor", () => {
      const params = {
        ...baseParams,
        formValuesAtualizados: {
          kit_lanche__dia_1__categoria_1: "8",
          observacoes__dia_1__categoria_1: "",
        },
        value_: "8",
      };

      const result =
        exibirTooltipQtdKitLancheDiferenteSolAlimentacoesAutorizadas(
          ...Object.values(params),
        );

      expect(result).toBe(false); // 8 === 8
    });

    it("deve retornar false quando observações estiver preenchida", () => {
      const params = {
        ...baseParams,
        formValuesAtualizados: {
          kit_lanche__dia_1__categoria_1: "10",
          observacoes__dia_1__categoria_1: "Observação preenchida",
        },
      };

      const result =
        exibirTooltipQtdKitLancheDiferenteSolAlimentacoesAutorizadas(
          ...Object.values(params),
        );

      expect(result).toBe(false);
    });

    it("deve retornar true quando não há valor mas há kit lanches autorizadas", () => {
      const params = {
        ...baseParams,
        formValuesAtualizados: {
          kit_lanche__dia_1__categoria_1: "",
          observacoes__dia_1__categoria_1: "",
        },
        value_: "",
      };

      const result =
        exibirTooltipQtdKitLancheDiferenteSolAlimentacoesAutorizadas(
          ...Object.values(params),
        );

      expect(result).toBe(true); // soma = 8 > 0
    });
  });

  describe("exibirTooltipQtdKitLancheMaiorSolAlimentacoesAutorizadas", () => {
    it("deve retornar true quando soma for MENOR que valor (operador <), mesmo com observações preenchidas", () => {
      const params = {
        ...baseParams,
        kitLanchesAutorizadas: [
          { dia: 1, numero_alunos: "2" },
          { dia: 1, numero_alunos: "1" },
        ], // soma = 3
        formValuesAtualizados: {
          kit_lanche__dia_1__categoria_1: "5",
          observacoes__dia_1__categoria_1: "Observação preenchida",
        },
        value_: "5",
      };

      const result = exibirTooltipQtdKitLancheMaiorSolAlimentacoesAutorizadas(
        ...Object.values(params),
      );

      expect(result).toBe(true); // 3 < 5, e ignora observações
    });

    it("deve retornar false quando soma for MAIOR que valor (operador <)", () => {
      const params = {
        ...baseParams,
        formValuesAtualizados: {
          kit_lanche__dia_1__categoria_1: "5",
          observacoes__dia_1__categoria_1: "",
        },
        value_: "5",
      };

      const result = exibirTooltipQtdKitLancheMaiorSolAlimentacoesAutorizadas(
        ...Object.values(params),
      );

      expect(result).toBe(false); // 8 < 5 é false
    });

    it("deve retornar true quando não há valor mas há kit lanches autorizadas", () => {
      const params = {
        ...baseParams,
        formValuesAtualizados: {
          kit_lanche__dia_1__categoria_1: "",
          observacoes__dia_1__categoria_1: "",
        },
        value_: "",
      };

      const result = exibirTooltipQtdKitLancheMaiorSolAlimentacoesAutorizadas(
        ...Object.values(params),
      );

      expect(result).toBe(true); // soma = 8 > 0
    });

    it("deve retornar true mesmo com observações preenchidas quando soma for menor", () => {
      const params = {
        ...baseParams,
        kitLanchesAutorizadas: [{ dia: 1, numero_alunos: "2" }], // soma = 2
        formValuesAtualizados: {
          kit_lanche__dia_1__categoria_1: "5",
          observacoes__dia_1__categoria_1: "Observação preenchida",
        },
        value_: "5",
      };

      const result = exibirTooltipQtdKitLancheMaiorSolAlimentacoesAutorizadas(
        ...Object.values(params),
      );

      expect(result).toBe(true); // 2 < 5, ignora observações
    });
  });

  describe("exibirTooltipQtdKitLancheMenorSolAlimentacoesAutorizadas", () => {
    it("deve retornar true quando soma for MAIOR que valor (operador >) e observações vazias", () => {
      const params = {
        ...baseParams,
        formValuesAtualizados: {
          kit_lanche__dia_1__categoria_1: "5",
          observacoes__dia_1__categoria_1: "",
        },
        value_: "5",
      };

      const result = exibirTooltipQtdKitLancheMenorSolAlimentacoesAutorizadas(
        ...Object.values(params),
      );

      expect(result).toBe(true); // 8 > 5
    });

    it("deve retornar false quando soma for MENOR que valor (operador >)", () => {
      const params = {
        ...baseParams,
        kitLanchesAutorizadas: [{ dia: 1, numero_alunos: "2" }], // soma = 2
        formValuesAtualizados: {
          kit_lanche__dia_1__categoria_1: "5",
          observacoes__dia_1__categoria_1: "",
        },
        value_: "5",
      };

      const result = exibirTooltipQtdKitLancheMenorSolAlimentacoesAutorizadas(
        ...Object.values(params),
      );

      expect(result).toBe(false); // 2 > 5 é false
    });

    it("deve retornar false quando observações estiver preenchida", () => {
      const params = {
        ...baseParams,
        formValuesAtualizados: {
          kit_lanche__dia_1__categoria_1: "5",
          observacoes__dia_1__categoria_1: "Observação preenchida",
        },
      };

      const result = exibirTooltipQtdKitLancheMenorSolAlimentacoesAutorizadas(
        ...Object.values(params),
      );

      expect(result).toBe(false);
    });

    it("deve retornar true quando não há valor mas há kit lanches autorizadas", () => {
      const params = {
        ...baseParams,
        formValuesAtualizados: {
          kit_lanche__dia_1__categoria_1: "",
          observacoes__dia_1__categoria_1: "",
        },
        value_: "",
      };

      const result = exibirTooltipQtdKitLancheMenorSolAlimentacoesAutorizadas(
        ...Object.values(params),
      );

      expect(result).toBe(true); // soma = 8 > 0
    });
  });

  // Testes de casos edge
  describe("Casos especiais", () => {
    it("deve retornar false para todas quando ehChangeInput é true e value_ é vazio", () => {
      const params = {
        ...baseParams,
        value_: "",
        ehChangeInput: true,
      };

      const resultDiferente =
        exibirTooltipQtdKitLancheDiferenteSolAlimentacoesAutorizadas(
          ...Object.values(params),
        );
      const resultMaior =
        exibirTooltipQtdKitLancheMaiorSolAlimentacoesAutorizadas(
          ...Object.values(params),
        );
      const resultMenor =
        exibirTooltipQtdKitLancheMenorSolAlimentacoesAutorizadas(
          ...Object.values(params),
        );

      expect(resultDiferente).toBe(false);
      expect(resultMaior).toBe(false);
      expect(resultMenor).toBe(false);
    });

    it('deve retornar false quando categoria não contém "SOLICITAÇÕES"', () => {
      const params = {
        ...baseParams,
        categoria: { id: 1, nome: "OUTRA CATEGORIA" },
        formValuesAtualizados: {
          kit_lanche__dia_1__categoria_1: "10",
          observacoes__dia_1__categoria_1: "",
        },
      };

      const resultDiferente =
        exibirTooltipQtdKitLancheDiferenteSolAlimentacoesAutorizadas(
          ...Object.values(params),
        );
      const resultMaior =
        exibirTooltipQtdKitLancheMaiorSolAlimentacoesAutorizadas(
          ...Object.values(params),
        );
      const resultMenor =
        exibirTooltipQtdKitLancheMenorSolAlimentacoesAutorizadas(
          ...Object.values(params),
        );

      expect(resultDiferente).toBe(false);
      expect(resultMaior).toBe(false);
      expect(resultMenor).toBe(false);
    });

    it("deve retornar false quando row.name não é kit_lanche", () => {
      const params = {
        ...baseParams,
        row: { name: "outro_campo" },
        formValuesAtualizados: {
          kit_lanche__dia_1__categoria_1: "10",
          observacoes__dia_1__categoria_1: "",
        },
      };

      const resultDiferente =
        exibirTooltipQtdKitLancheDiferenteSolAlimentacoesAutorizadas(
          ...Object.values(params),
        );
      const resultMaior =
        exibirTooltipQtdKitLancheMaiorSolAlimentacoesAutorizadas(
          ...Object.values(params),
        );
      const resultMenor =
        exibirTooltipQtdKitLancheMenorSolAlimentacoesAutorizadas(
          ...Object.values(params),
        );

      expect(resultDiferente).toBe(false);
      expect(resultMaior).toBe(false);
      expect(resultMenor).toBe(false);
    });

    it('deve retornar false quando valor é "Mês anterior" ou "Mês posterior"', () => {
      const testCases = ["Mês anterior", "Mês posterior"];

      testCases.forEach((valor) => {
        const params = {
          ...baseParams,
          formValuesAtualizados: {
            kit_lanche__dia_1__categoria_1: valor,
            observacoes__dia_1__categoria_1: "",
          },
          value_: valor,
        };

        const resultDiferente =
          exibirTooltipQtdKitLancheDiferenteSolAlimentacoesAutorizadas(
            ...Object.values(params),
          );
        const resultMaior =
          exibirTooltipQtdKitLancheMaiorSolAlimentacoesAutorizadas(
            ...Object.values(params),
          );
        const resultMenor =
          exibirTooltipQtdKitLancheMenorSolAlimentacoesAutorizadas(
            ...Object.values(params),
          );

        expect(resultDiferente).toBe(false);
        expect(resultMaior).toBe(false);
        expect(resultMenor).toBe(false);
      });
    });
  });
});
