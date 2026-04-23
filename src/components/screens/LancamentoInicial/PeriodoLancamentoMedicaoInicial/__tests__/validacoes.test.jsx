import {
  exibirTooltipQtdKitLancheDiferenteSolAlimentacoesAutorizadas,
  exibirTooltipQtdKitLancheMenorSolAlimentacoesAutorizadas,
  exibirTooltipRefeicaoSimultanea,
  bloquearSalvamentoRefeicaoSimultanea,
} from "../validacoes";

import { getDiasCalendario } from "src/services/medicaoInicial/periodoLancamentoMedicao.service";
import {
  carregarDiasCalendario,
  exibirTooltipPeriodosZeradosNoProgramasProjetos,
  boqueaSalvamentoPeriodosZeradosNoProgramasProjetos,
  habitarBotaoAdicionar,
} from "src/components/screens/LancamentoInicial/PeriodoLancamentoMedicaoInicial/validacoes.jsx";
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
jest.mock("src/components/screens/LancamentoInicial/constants", () => ({
  ALUNOS_EMEBS: {
    INFANTIL: { key: "infantil" },
    FUNDAMENTAL: { key: "fundamental" },
  },
}));
describe("Testes de períodos zerados no Programas e Projetos", () => {
  describe("exibirTooltipPeriodosZeradosNoProgramasProjetos", () => {
    const categoriaAlimentacao = { id: 1, nome: "ALIMENTAÇÃO" };
    const categoriaDieta = { id: 2, nome: "DIETA ESPECIAL - TIPO A" };
    const diasFrequenciaZerada = {
      alimentacoes: ["02"],
      dietas: {
        "DIETA ESPECIAL - TIPO A": ["01"],
      },
    };
    const diasFrequenciaZeradaEMEBS = {
      alimentacoes: {
        INFANTIL: ["05"],
        FUNDAMENTAL: [],
      },
    };

    let baseFormValues = {
      frequencia__dia_02__categoria_1: "5",
      frequencia__dia_01__categoria_2: "3",
      frequencia__dia_05__categoria_1: "4",
    };

    it("não deve exibir tooltip se o grupo não for Programas e Projetos", () => {
      const result = exibirTooltipPeriodosZeradosNoProgramasProjetos(
        "frequencia",
        "01",
        categoriaAlimentacao,
        baseFormValues,
        diasFrequenciaZerada,
        "MANHA",
      );

      expect(result).toBe(false);
    });

    it("não deve exibir tooltip se o row não for frequencia", () => {
      const result = exibirTooltipPeriodosZeradosNoProgramasProjetos(
        "lanche",
        "01",
        categoriaAlimentacao,
        baseFormValues,
        diasFrequenciaZerada,
        "Programas e Projetos",
      );

      expect(result).toBe(false);
    });
    it("não deve exibir tooltip para categoria de SOLICITAÇÕES", () => {
      const categoria = { id: 3, nome: "SOLICITAÇÕES DE ALIMENTAÇÃO" };
      const result = exibirTooltipPeriodosZeradosNoProgramasProjetos(
        "frequencia",
        "01",
        categoria,
        baseFormValues,
        diasFrequenciaZerada,
        "Programas e Projetos",
      );

      expect(result).toBe(false);
    });

    it("não deve exibir tooltip se o dia não estiver em diasFrequenciaZerada", () => {
      const result = exibirTooltipPeriodosZeradosNoProgramasProjetos(
        "frequencia",
        "01",
        categoriaAlimentacao,
        baseFormValues,
        diasFrequenciaZerada,
        "Programas e Projetos",
      );

      expect(result).toBe(false);
    });
    it("deve exibir tooltip quando o dia estiver zerado, valor > 0 e sem observação (EMEF)", () => {
      const result = exibirTooltipPeriodosZeradosNoProgramasProjetos(
        "frequencia",
        "02",
        categoriaAlimentacao,
        baseFormValues,
        diasFrequenciaZerada,
        "Programas e Projetos",
      );

      expect(result).toBe(true);
    });

    it("não deve exibir tooltip quando houver observação preenchida", () => {
      baseFormValues = {
        ...baseFormValues,
        observacoes__dia_02__categoria_1: "Justificativa válida",
      };

      const result = exibirTooltipPeriodosZeradosNoProgramasProjetos(
        "frequencia",
        "01",
        categoriaAlimentacao,
        baseFormValues,
        diasFrequenciaZerada,
        "Programas e Projetos",
      );

      expect(result).toBe(false);
    });

    it("não deve exibir tooltip quando o valor for 0", () => {
      baseFormValues = {
        ...baseFormValues,
        frequencia__dia_01__categoria_1: "0",
      };

      const result = exibirTooltipPeriodosZeradosNoProgramasProjetos(
        "frequencia",
        "01",
        categoriaAlimentacao,
        baseFormValues,
        diasFrequenciaZerada,
        "Programas e Projetos",
      );

      expect(result).toBe(false);
    });

    it("deve exibir tooltip para dieta quando dia estiver em dietas", () => {
      const result = exibirTooltipPeriodosZeradosNoProgramasProjetos(
        "frequencia",
        "01",
        categoriaDieta,
        baseFormValues,
        diasFrequenciaZerada,
        "Programas e Projetos",
      );

      expect(result).toBe(true);
    });

    it("deve exibir tooltip para EMEBS considerando a aba selecionada", () => {
      const result = exibirTooltipPeriodosZeradosNoProgramasProjetos(
        "frequencia",
        "05",
        categoriaAlimentacao,
        baseFormValues,
        diasFrequenciaZeradaEMEBS,
        "Programas e Projetos",
        true,
        "infantil",
      );

      expect(result).toBe(true);
    });
  });

  describe("boqueaSalvamentoPeriodosZeradosNoProgramasProjetos", () => {
    const categorias = [
      { id: 1, nome: "ALIMENTAÇÃO" },
      { id: 2, nome: "DIETA ESPECIAL - TIPO A" },
      { id: 3, nome: "DIETA ESPECIAL - TIPO B" },
    ];

    const grupoValido = "Programas e Projetos";

    const diasFrequenciaZerada = {
      alimentacoes: ["01"],
      dietas: {
        "DIETA ESPECIAL - TIPO A": ["02"],
        "DIETA ESPECIAL - TIPO A - ENTERAL / RESTRIÇÃO DE AMINOÁCIDOS": [],
        "DIETA ESPECIAL - TIPO B": ["03"],
      },
    };

    const weekColumns = [{ dia: "01" }, { dia: "02" }, { dia: "03" }];

    it("não deve bloquear salvamento se o grupo não for Programas e Projetos", () => {
      const result = boqueaSalvamentoPeriodosZeradosNoProgramasProjetos(
        "frequencia",
        categorias,
        {},
        {},
        "MANHA",
        false,
        null,
        weekColumns,
      );

      expect(result).toBe(false);
    });

    it("deve bloquear salvamento quando houver alimentação zerada com valor > 0 e sem observação (EMEF)", () => {
      const formValues = {
        frequencia__dia_01__categoria_1: "5",
      };

      const result = boqueaSalvamentoPeriodosZeradosNoProgramasProjetos(
        "frequencia",
        categorias,
        formValues,
        diasFrequenciaZerada,
        grupoValido,
        false,
        null,
        weekColumns,
      );

      expect(result).toBe(true);
    });

    it("não deve bloquear se houver observação preenchida", () => {
      const formValues = {
        frequencia__dia_01__categoria_1: "5",
        observacoes__dia_01__categoria_1: "Justificado",
      };

      const result = boqueaSalvamentoPeriodosZeradosNoProgramasProjetos(
        "frequencia",
        categorias,
        formValues,
        diasFrequenciaZerada,
        grupoValido,
        false,
        null,
        weekColumns,
      );

      expect(result).toBe(false);
    });

    it("deve bloquear salvamento quando houver dieta zerada com valor > 0", () => {
      const formValues = {
        frequencia__dia_02__categoria_2: "3",
      };

      const result = boqueaSalvamentoPeriodosZeradosNoProgramasProjetos(
        "frequencia",
        categorias,
        formValues,
        diasFrequenciaZerada,
        grupoValido,
        false,
        null,
        weekColumns,
      );

      expect(result).toBe(true);
    });

    it("não deve bloquear quando valor for 0 mesmo que o dia esteja zerado", () => {
      const formValues = {
        frequencia__dia_01__categoria_1: "0",
      };

      const result = boqueaSalvamentoPeriodosZeradosNoProgramasProjetos(
        "frequencia",
        categorias,
        formValues,
        diasFrequenciaZerada,
        grupoValido,
        false,
        null,
        weekColumns,
      );

      expect(result).toBe(false);
    });

    it("deve bloquear salvamento para EMEBS considerando aba selecionada", () => {
      const diasFrequenciaZerada = {
        alimentacoes: {
          INFANTIL: ["01"],
          FUNDAMENTAL: [],
        },
        dietas: {},
      };

      const formValues = {
        frequencia__dia_01__categoria_1: "4",
      };

      const result = boqueaSalvamentoPeriodosZeradosNoProgramasProjetos(
        "frequencia",
        categorias,
        formValues,
        diasFrequenciaZerada,
        grupoValido,
        true,
        "infantil",
        weekColumns,
      );

      expect(result).toBe(true);
    });
    it("não deve bloquear se o dia não estiver na aba selecionada (EMEBS)", () => {
      const diasFrequenciaZerada = {
        alimentacoes: {
          INFANTIL: ["01"],
          FUNDAMENTAL: [],
        },
        dietas: {
          "DIETA ESPECIAL - TIPO A": {
            INFANTIL: [],
            FUNDAMENTAL: [],
          },
          "DIETA ESPECIAL - TIPO A - ENTERAL / RESTRIÇÃO DE AMINOÁCIDOS": {
            INFANTIL: [],
            FUNDAMENTAL: [],
          },
          "DIETA ESPECIAL - TIPO B": {
            INFANTIL: [],
            FUNDAMENTAL: [],
          },
        },
      };

      const formValues = {
        frequencia__dia_01__categoria_1: "4",
      };

      const result = boqueaSalvamentoPeriodosZeradosNoProgramasProjetos(
        "frequencia",
        categorias,
        formValues,
        diasFrequenciaZerada,
        grupoValido,
        true,
        "fundamental",
        weekColumns,
      );

      expect(result).toBe(false);
    });

    it("não deve bloquear se o dia não estiver na aba selecionada (EMEBS)", () => {
      const diasFrequenciaZerada = {
        alimentacoes: {
          INFANTIL: ["01"],
          FUNDAMENTAL: [],
        },
        dietas: {
          "DIETA ESPECIAL - TIPO A": {
            INFANTIL: [],
            FUNDAMENTAL: [],
          },
          "DIETA ESPECIAL - TIPO A - ENTERAL / RESTRIÇÃO DE AMINOÁCIDOS": {
            INFANTIL: [],
            FUNDAMENTAL: [],
          },
          "DIETA ESPECIAL - TIPO B": {
            INFANTIL: [],
            FUNDAMENTAL: [],
          },
        },
      };

      const formValues = {
        frequencia__dia_01__categoria_1: "4",
      };

      const result = boqueaSalvamentoPeriodosZeradosNoProgramasProjetos(
        "frequencia",
        categorias,
        formValues,
        diasFrequenciaZerada,
        grupoValido,
        true,
        "fundamental",
        weekColumns,
      );

      expect(result).toBe(false);
    });

    it("deve bloquear se qualquer categoria atender à regra", () => {
      const formValues = {
        frequencia__dia_03__categoria_3: "10",
      };

      const result = boqueaSalvamentoPeriodosZeradosNoProgramasProjetos(
        "frequencia",
        categorias,
        formValues,
        diasFrequenciaZerada,
        grupoValido,
        false,
        null,
        weekColumns,
      );

      expect(result).toBe(true);
    });
  });

  describe("habitarBotaoAdicionar", () => {
    const categoriaAlimentacao = { id: 1, nome: "ALIMENTAÇÃO" };
    const categoriaDieta = { id: 2, nome: "DIETA ESPECIAL - TIPO A" };
    const grupoValido = "Programas e Projetos";

    it("não deve habilitar botão se grupo não for Programas e Projetos", () => {
      const result = habitarBotaoAdicionar(
        "frequencia",
        "01",
        categoriaAlimentacao,
        {},
        {},
        "Outro Grupo",
        false,
      );

      expect(result).toBe(false);
    });

    it("não deve habilitar botão para categoria SOLICITAÇÕES", () => {
      const categoria = { id: 3, nome: "SOLICITAÇÕES DIVERSAS" };

      const result = habitarBotaoAdicionar(
        "frequencia",
        "01",
        categoria,
        {},
        {},
        grupoValido,
        false,
      );

      expect(result).toBe(false);
    });

    it("não deve habilitar botão se o dia não estiver em diasFrequenciaZerada", () => {
      const diasFrequenciaZerada = {
        alimentacoes: ["02"],
      };

      const result = habitarBotaoAdicionar(
        "frequencia",
        "01",
        categoriaAlimentacao,
        {},
        diasFrequenciaZerada,
        grupoValido,
        false,
      );

      expect(result).toBe(false);
    });

    it("deve habilitar botão quando valor > 0 e sem observação (EMEF)", () => {
      const diasFrequenciaZerada = {
        alimentacoes: ["01"],
      };

      const formValues = {
        frequencia__dia_01__categoria_1: "5",
      };

      const result = habitarBotaoAdicionar(
        "frequencia",
        "01",
        categoriaAlimentacao,
        formValues,
        diasFrequenciaZerada,
        grupoValido,
        false,
      );

      expect(result).toBe(true);
    });

    it("não deve habilitar botão quando houver observação preenchida", () => {
      const diasFrequenciaZerada = {
        alimentacoes: ["01"],
      };

      const formValues = {
        frequencia__dia_01__categoria_1: "5",
        observacoes__dia_01__categoria_1: "Justificado",
      };

      const result = habitarBotaoAdicionar(
        "frequencia",
        "01",
        categoriaAlimentacao,
        formValues,
        diasFrequenciaZerada,
        grupoValido,
        false,
      );

      expect(result).toBe(false);
    });

    it("não deve habilitar botão quando valor for 0", () => {
      const diasFrequenciaZerada = {
        alimentacoes: ["01"],
      };

      const formValues = {
        frequencia__dia_01__categoria_1: "0",
      };

      const result = habitarBotaoAdicionar(
        "frequencia",
        "01",
        categoriaAlimentacao,
        formValues,
        diasFrequenciaZerada,
        grupoValido,
        false,
      );

      expect(result).toBe(false);
    });

    it("deve habilitar botão para dieta quando aplicável (EMEF)", () => {
      const diasFrequenciaZerada = {
        dietas: {
          "DIETA ESPECIAL - TIPO A": ["01"],
        },
      };

      const formValues = {
        frequencia__dia_01__categoria_2: "3",
      };

      const result = habitarBotaoAdicionar(
        "frequencia",
        "01",
        categoriaDieta,
        formValues,
        diasFrequenciaZerada,
        grupoValido,
        false,
      );

      expect(result).toBe(true);
    });

    it("deve habilitar botão para EMEBS considerando aba selecionada", () => {
      const diasFrequenciaZerada = {
        alimentacoes: {
          INFANTIL: ["01"],
          FUNDAMENTAL: [],
        },
      };

      const formValues = {
        frequencia__dia_01__categoria_1: "4",
      };

      const result = habitarBotaoAdicionar(
        "frequencia",
        "01",
        categoriaAlimentacao,
        formValues,
        diasFrequenciaZerada,
        grupoValido,
        true,
        "infantil",
      );

      expect(result).toBe(true);
    });

    it("não deve habilitar botão se dia não estiver na aba selecionada (EMEBS)", () => {
      const diasFrequenciaZerada = {
        alimentacoes: {
          INFANTIL: ["01"],
          FUNDAMENTAL: [],
        },
      };

      const formValues = {
        frequencia__dia_01__categoria_1: "4",
      };

      const result = habitarBotaoAdicionar(
        "frequencia",
        "01",
        categoriaAlimentacao,
        formValues,
        diasFrequenciaZerada,
        grupoValido,
        true,
        "fundamental",
      );

      expect(result).toBe(false);
    });
  });
});

describe("Testes de Refeicao Simultanea em período noturno e unidades CEIJA", () => {
  describe("exibirTooltipRefeicaoSimultanea", () => {
    const column = { dia: 1 };
    const categoria = { id: 1 };

    const buildBase = () => `__dia_${column.dia}__categoria_${categoria.id}`;

    const defaultRow = { name: "lanche_4h" };

    const buildFormValues = ({
      lanche_4h = 0,
      refeicao = 0,
      sobremesa = 0,
      observacoes = "",
      rowValue = 0,
    } = {}) => {
      const base = buildBase();

      return {
        [`refeicao${base}`]: refeicao,
        [`sobremesa${base}`]: sobremesa,
        [`observacoes${base}`]: observacoes,
        [`lanche_4h${base}`]: rowValue ?? lanche_4h,
      };
    };

    test("retorna false quando não é NOITE nem CIEJA", () => {
      const form = buildFormValues({ lanche_4h: 1, refeicao: 1 });

      const result = exibirTooltipRefeicaoSimultanea(
        form,
        defaultRow,
        column,
        categoria,
        false,
        "MANHA",
      );

      expect(result).toBe(false);
    });

    test("retorna false quando apenas 1 item ativo", () => {
      const form = buildFormValues({ lanche_4h: 1 });

      const result = exibirTooltipRefeicaoSimultanea(
        form,
        defaultRow,
        column,
        categoria,
        false,
        "NOITE",
      );

      expect(result).toBe(false);
    });

    test("retorna false quando há observação", () => {
      const form = buildFormValues({
        lanche_4h: 1,
        refeicao: 1,
        observacoes: "texto",
      });

      const result = exibirTooltipRefeicaoSimultanea(
        form,
        defaultRow,
        column,
        categoria,
        false,
        "NOITE",
      );

      expect(result).toBe(false);
    });

    test("retorna false quando row.name não é lanche_4h", () => {
      const form = buildFormValues({
        lanche_4h: 1,
        refeicao: 1,
      });

      const result = exibirTooltipRefeicaoSimultanea(
        form,
        { name: "refeicao" },
        column,
        categoria,
        false,
        "NOITE",
      );

      expect(result).toBe(false);
    });

    test("retorna false quando lanche_4h é 0 no row", () => {
      const form = buildFormValues({
        lanche_4h: 0,
        refeicao: 1,
        sobremesa: 1,
      });

      const result = exibirTooltipRefeicaoSimultanea(
        form,
        defaultRow,
        column,
        categoria,
        false,
        "NOITE",
      );

      expect(result).toBe(false);
    });

    test("retorna true quando condições são atendidas (NOITE)", () => {
      const form = buildFormValues({
        lanche_4h: 1,
        refeicao: 1,
        rowValue: null,
      });

      const result = exibirTooltipRefeicaoSimultanea(
        form,
        defaultRow,
        column,
        categoria,
        false,
        "NOITE",
      );

      expect(result).toBe(true);
    });

    test("retorna true quando é escola CIEJA mesmo fora de NOITE", () => {
      const form = buildFormValues({
        lanche_4h: 1,
        sobremesa: 1,
        rowValue: null,
      });

      const result = exibirTooltipRefeicaoSimultanea(
        form,
        defaultRow,
        column,
        categoria,
        true,
        "MANHA",
      );

      expect(result).toBe(true);
    });

    test("trata valores undefined como 0", () => {
      const form = {};

      const result = exibirTooltipRefeicaoSimultanea(
        form,
        defaultRow,
        column,
        categoria,
        false,
        "NOITE",
      );

      expect(result).toBe(false);
    });

    test("retorna false com 2 ativos sem lanche_4h", () => {
      const form = buildFormValues({
        refeicao: 1,
        sobremesa: 1,
      });

      const result = exibirTooltipRefeicaoSimultanea(
        form,
        defaultRow,
        column,
        categoria,
        false,
        "NOITE",
      );

      expect(result).toBe(false);
    });

    test("retorna true com 3 ativos", () => {
      const form = buildFormValues({
        lanche_4h: 1,
        refeicao: 1,
        sobremesa: 1,
        rowValue: null,
      });

      const result = exibirTooltipRefeicaoSimultanea(
        form,
        defaultRow,
        column,
        categoria,
        false,
        "NOITE",
      );

      expect(result).toBe(true);
    });

    test("retorna false quando rowValue = 0 mesmo com ativos", () => {
      const form = buildFormValues({
        refeicao: 1,
        rowValue: 0,
      });

      const result = exibirTooltipRefeicaoSimultanea(
        form,
        defaultRow,
        column,
        categoria,
        false,
        "NOITE",
      );

      expect(result).toBe(false);
    });

    test("não bloqueia quando observação é null", () => {
      const form = buildFormValues({
        lanche_4h: 1,
        refeicao: 1,
        observacoes: null,
        rowValue: null,
      });

      const result = exibirTooltipRefeicaoSimultanea(
        form,
        defaultRow,
        column,
        categoria,
        false,
        "NOITE",
      );

      expect(result).toBe(true);
    });

    test("retorna false mesmo com cenário válido", () => {
      const form = buildFormValues({
        lanche_4h: 1,
        refeicao: 1,
        rowValue: null,
      });

      const result = exibirTooltipRefeicaoSimultanea(
        form,
        { name: "matriculados" },
        column,
        categoria,
        false,
        "NOITE",
      );
      expect(result).toBe(false);
    });

    test("retorna false com 3 ativos", () => {
      const form = buildFormValues({
        lanche_4h: 1,
        refeicao: 1,
        sobremesa: 1,
        rowValue: null,
      });

      const result = exibirTooltipRefeicaoSimultanea(
        form,
        { name: "frequencia" },
        column,
        categoria,
        false,
        "NOITE",
      );

      expect(result).toBe(false);
    });

    test("retorna false com CIEJA e cenário válido", () => {
      const form = buildFormValues({
        lanche_4h: 1,
        sobremesa: 1,
        rowValue: null,
      });

      const result = exibirTooltipRefeicaoSimultanea(
        form,
        { name: "refeicao" },
        column,
        categoria,
        true,
        "MANHA",
      );

      expect(result).toBe(false);
    });

    test("retorna false mesmo sem observação e múltiplos ativos", () => {
      const form = buildFormValues({
        lanche_4h: 1,
        refeicao: 1,
        sobremesa: 1,
        observacoes: "",
        rowValue: null,
      });

      const result = exibirTooltipRefeicaoSimultanea(
        form,
        { name: "sobremesa" },
        column,
        categoria,
        false,
        "NOITE",
      );

      expect(result).toBe(false);
    });
  });

  describe("bloquearSalvamentoRefeicaoSimultanea", () => {
    const weekColumns = [{ dia: 1 }, { dia: 2 }];
    const categorias = [{ id: 1 }, { id: 2 }];

    const buildBase = (dia, categoriaId) =>
      `__dia_${dia}__categoria_${categoriaId}`;

    const buildFormValues = (entries = []) => {
      const form = {};

      entries.forEach(
        ({
          dia,
          categoriaId,
          lanche_4h = 0,
          refeicao = 0,
          sobremesa = 0,
          observacoes = "",
        }) => {
          const base = buildBase(dia, categoriaId);

          form[`lanche_4h${base}`] = lanche_4h;
          form[`refeicao${base}`] = refeicao;
          form[`sobremesa${base}`] = sobremesa;
          form[`observacoes${base}`] = observacoes;
        },
      );

      return form;
    };

    test("retorna false quando não é NOITE nem CIEJA", () => {
      const form = buildFormValues([
        { dia: 1, categoriaId: 1, lanche_4h: 1, refeicao: 1 },
      ]);

      const result = bloquearSalvamentoRefeicaoSimultanea(
        form,
        weekColumns,
        categorias,
        false,
        "MANHA",
      );

      expect(result).toBe(false);
    });

    test("retorna false quando todos têm <=1 ativo", () => {
      const form = buildFormValues([
        { dia: 1, categoriaId: 1, lanche_4h: 1 },
        { dia: 2, categoriaId: 2, refeicao: 1 },
      ]);

      const result = bloquearSalvamentoRefeicaoSimultanea(
        form,
        weekColumns,
        categorias,
        false,
        "NOITE",
      );

      expect(result).toBe(false);
    });

    test("retorna false quando há observação mesmo com múltiplos ativos", () => {
      const form = buildFormValues([
        {
          dia: 1,
          categoriaId: 1,
          lanche_4h: 1,
          refeicao: 1,
          observacoes: "obs",
        },
      ]);

      const result = bloquearSalvamentoRefeicaoSimultanea(
        form,
        weekColumns,
        categorias,
        false,
        "NOITE",
      );

      expect(result).toBe(false);
    });

    test("retorna true quando encontra combinação válida", () => {
      const form = buildFormValues([
        {
          dia: 2,
          categoriaId: 2,
          lanche_4h: 1,
          refeicao: 1,
        },
      ]);

      const result = bloquearSalvamentoRefeicaoSimultanea(
        form,
        weekColumns,
        categorias,
        false,
        "NOITE",
      );

      expect(result).toBe(true);
    });

    test("retorna true com CIEJA mesmo fora de NOITE", () => {
      const form = buildFormValues([
        {
          dia: 1,
          categoriaId: 1,
          lanche_4h: 1,
          sobremesa: 1,
        },
      ]);

      const result = bloquearSalvamentoRefeicaoSimultanea(
        form,
        weekColumns,
        categorias,
        true,
        "MANHA",
      );

      expect(result).toBe(true);
    });

    test("retorna false quando lanche_4h = 0 mesmo com múltiplos ativos", () => {
      const form = buildFormValues([
        {
          dia: 1,
          categoriaId: 1,
          lanche_4h: 0,
          refeicao: 1,
          sobremesa: 1,
        },
      ]);

      const result = bloquearSalvamentoRefeicaoSimultanea(
        form,
        weekColumns,
        categorias,
        false,
        "NOITE",
      );

      expect(result).toBe(false);
    });

    test("retorna false quando nenhum caso válido em múltiplas iterações", () => {
      const form = buildFormValues([
        { dia: 1, categoriaId: 1, lanche_4h: 1 }, // inválido
        { dia: 2, categoriaId: 2, refeicao: 1, sobremesa: 1, observacoes: "x" }, // ignorado
      ]);

      const result = bloquearSalvamentoRefeicaoSimultanea(
        form,
        weekColumns,
        categorias,
        false,
        "NOITE",
      );

      expect(result).toBe(false);
    });

    test("trata valores undefined como 0", () => {
      const form = {};

      const result = bloquearSalvamentoRefeicaoSimultanea(
        form,
        weekColumns,
        categorias,
        false,
        "NOITE",
      );

      expect(result).toBe(false);
    });
    test("para no primeiro caso válido", () => {
      const form = buildFormValues([
        { dia: 1, categoriaId: 1, lanche_4h: 1, refeicao: 1 }, // válido
        { dia: 2, categoriaId: 2, lanche_4h: 0, refeicao: 1, sobremesa: 1 }, // não deveria importar
      ]);

      const result = bloquearSalvamentoRefeicaoSimultanea(
        form,
        weekColumns,
        categorias,
        false,
        "NOITE",
      );

      expect(result).toBe(true);
    });
  });
});
