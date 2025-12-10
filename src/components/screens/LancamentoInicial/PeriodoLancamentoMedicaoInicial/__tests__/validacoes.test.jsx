import {
  exibirTooltipQtdKitLancheDiferenteSolAlimentacoesAutorizadas,
  exibirTooltipQtdKitLancheMenorSolAlimentacoesAutorizadas,
} from "../validacoes";

import { getDiasCalendario } from "src/services/medicaoInicial/periodoLancamentoMedicao.service";
import { carregarDiasCalendario } from "src/components/screens/LancamentoInicial/PeriodoLancamentoMedicaoInicial/validacoes.jsx";
import { mockDiasCalendarioNoturnoJaneiro2025 } from "src/mocks/escola/diaCalendario/periodoNoturno.jsx";
import { mockDiasCalendarioDiurnoJaneiro2025 } from "src/mocks/escola/diaCalendario/periodoDiurno.jsx";

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
      const resultMenor =
        exibirTooltipQtdKitLancheMenorSolAlimentacoesAutorizadas(
          ...Object.values(params),
        );

      expect(resultDiferente).toBe(false);
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
      const resultMenor =
        exibirTooltipQtdKitLancheMenorSolAlimentacoesAutorizadas(
          ...Object.values(params),
        );

      expect(resultDiferente).toBe(false);
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
        const resultMenor =
          exibirTooltipQtdKitLancheMenorSolAlimentacoesAutorizadas(
            ...Object.values(params),
          );
        expect(resultDiferente).toBe(false);
        expect(resultMenor).toBe(false);
      });
    });
  });
});

jest.mock(
  "src/services/medicaoInicial/periodoLancamentoMedicao.service",
  () => ({
    getDiasCalendario: jest.fn(),
  }),
);

describe("Testa o carregamento de dias úteis", () => {
  const escolaUuid = "946e3b04-08c1-4838-81d7-4f9625a727f7";
  const mes = 1;
  const ano = 2025;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("retorna lista diurna quando periodoUuid é null", async () => {
    getDiasCalendario.mockResolvedValue({
      data: mockDiasCalendarioDiurnoJaneiro2025,
      status: 200,
    });

    const result = await carregarDiasCalendario(escolaUuid, mes, ano, null);

    expect(result).toEqual(mockDiasCalendarioDiurnoJaneiro2025);
    expect(getDiasCalendario).toHaveBeenCalledTimes(1);
    expect(getDiasCalendario).toHaveBeenCalledWith({
      escola_uuid: escolaUuid,
      mes,
      ano,
      periodo_escolar_uuid: null,
    });
  });

  it("retorna lista noturna quando periodoUuid é fornecido e API retorna dados", async () => {
    const periodoUuid =
      mockDiasCalendarioNoturnoJaneiro2025[0].periodo_escolar.uuid;

    getDiasCalendario.mockResolvedValue({
      data: mockDiasCalendarioNoturnoJaneiro2025,
      status: 200,
    });

    const result = await carregarDiasCalendario(
      escolaUuid,
      mes,
      ano,
      periodoUuid,
    );

    expect(result).toEqual(mockDiasCalendarioNoturnoJaneiro2025);
    expect(getDiasCalendario).toHaveBeenCalledTimes(1);
    expect(getDiasCalendario).toHaveBeenCalledWith({
      escola_uuid: escolaUuid,
      mes,
      ano,
      periodo_escolar_uuid: periodoUuid,
    });
  });

  it("quando API retorna vazio para noturno, faz fallback e retorna lista diurna", async () => {
    const periodoUuid =
      mockDiasCalendarioNoturnoJaneiro2025[0].periodo_escolar.uuid;

    getDiasCalendario
      .mockResolvedValueOnce({ data: [], status: 200 })
      .mockResolvedValueOnce({
        data: mockDiasCalendarioDiurnoJaneiro2025,
        status: 200,
      });

    const result = await carregarDiasCalendario(
      escolaUuid,
      mes,
      ano,
      periodoUuid,
    );

    expect(result).toEqual(mockDiasCalendarioDiurnoJaneiro2025);
    expect(getDiasCalendario).toHaveBeenCalledTimes(2);

    expect(getDiasCalendario.mock.calls[0][0]).toEqual({
      escola_uuid: escolaUuid,
      mes,
      ano,
      periodo_escolar_uuid: periodoUuid,
    });

    expect(getDiasCalendario.mock.calls[1][0]).toEqual({
      escola_uuid: escolaUuid,
      mes,
      ano,
      periodo_escolar_uuid: null,
    });
  });

  test("NÃO faz fallback quando periodoUuid é null, mesmo com dados vazios", async () => {
    getDiasCalendario.mockResolvedValueOnce({
      data: [],
      status: 200,
    });

    const result = await carregarDiasCalendario(escolaUuid, mes, ano, null);

    expect(result).toEqual([]);

    expect(getDiasCalendario).toHaveBeenCalledTimes(1);

    expect(getDiasCalendario).toHaveBeenCalledWith({
      escola_uuid: escolaUuid,
      mes,
      ano,
      periodo_escolar_uuid: null,
    });
  });
});
