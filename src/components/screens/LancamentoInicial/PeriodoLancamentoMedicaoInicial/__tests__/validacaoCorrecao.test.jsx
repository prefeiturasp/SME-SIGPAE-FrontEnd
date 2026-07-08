import { ehDiaParaCorrigir } from "../helper";

const CORRECTION_STATUSES = [
  "MEDICAO_CORRECAO_SOLICITADA",
  "MEDICAO_CORRECAO_SOLICITADA_CODAE",
  "MEDICAO_CORRIGIDA_PELA_UE",
  "MEDICAO_CORRIGIDA_PARA_CODAE",
];

const READ_ONLY_ROWS = [
  "matriculados",
  "numero_de_alunos",
  "dietas_autorizadas",
  "participantes",
];

const validaCorrecaoCampoVazio = ({
  statusPeriodo,
  rowName,
  dia,
  idCategoria,
  value,
  diasParaCorrecao,
  valoresPeriodosLancamentos = [],
  escolaEhEMEBS = false,
  alunosTabSelecionada = null,
}) => {
  const isInCorrectionMode =
    statusPeriodo && CORRECTION_STATUSES.includes(statusPeriodo);
  if (!isInCorrectionMode) return undefined;

  const isCorrectionDay = ehDiaParaCorrigir(
    dia,
    idCategoria,
    valoresPeriodosLancamentos,
    diasParaCorrecao,
  );
  if (!isCorrectionDay) return undefined;

  if (READ_ONLY_ROWS.includes(rowName)) return undefined;

  if (escolaEhEMEBS && alunosTabSelecionada) {
    const temCorrecaoParaTabAtual = diasParaCorrecao?.some(
      (d) =>
        String(d.dia) === String(dia) &&
        String(d.categoria_medicao) === String(idCategoria) &&
        d.habilitado_correcao &&
        (!d.infantil_ou_fundamental ||
          d.infantil_ou_fundamental === alunosTabSelecionada ||
          d.infantil_ou_fundamental === "INFANTIL OU FUNDAMENTAL"),
    );
    if (!temCorrecaoParaTabAtual) return undefined;
  }

  if (value === "" || value === null || value === undefined) {
    return "Preenchimento obrigatório.";
  }

  return undefined;
};

describe("validaCorrecaoCampoVazio - EMEF", () => {
  const defaultDiasParaCorrecao = [
    { dia: "01", categoria_medicao: 1, habilitado_correcao: true },
    { dia: "15", categoria_medicao: 2, habilitado_correcao: true },
  ];

  describe("modo correção", () => {
    it('retorna "Preenchimento obrigatório." quando campo de correção está vazio (empty string)', () => {
      const result = validaCorrecaoCampoVazio({
        statusPeriodo: "MEDICAO_CORRECAO_SOLICITADA",
        rowName: "frequencia",
        dia: "01",
        idCategoria: 1,
        value: "",
        diasParaCorrecao: defaultDiasParaCorrecao,
      });
      expect(result).toBe("Preenchimento obrigatório.");
    });

    it('retorna "Preenchimento obrigatório." quando campo de correção está null', () => {
      const result = validaCorrecaoCampoVazio({
        statusPeriodo: "MEDICAO_CORRECAO_SOLICITADA",
        rowName: "frequencia",
        dia: "01",
        idCategoria: 1,
        value: null,
        diasParaCorrecao: defaultDiasParaCorrecao,
      });
      expect(result).toBe("Preenchimento obrigatório.");
    });

    it('retorna "Preenchimento obrigatório." quando campo de correção está undefined', () => {
      const result = validaCorrecaoCampoVazio({
        statusPeriodo: "MEDICAO_CORRECAO_SOLICITADA",
        rowName: "frequencia",
        dia: "01",
        idCategoria: 1,
        value: undefined,
        diasParaCorrecao: defaultDiasParaCorrecao,
      });
      expect(result).toBe("Preenchimento obrigatório.");
    });

    it("NÃO retorna erro quando campo de correção está preenchido com '0'", () => {
      const result = validaCorrecaoCampoVazio({
        statusPeriodo: "MEDICAO_CORRECAO_SOLICITADA",
        rowName: "frequencia",
        dia: "01",
        idCategoria: 1,
        value: "0",
        diasParaCorrecao: defaultDiasParaCorrecao,
      });
      expect(result).toBeUndefined();
    });

    it("NÃO retorna erro quando campo de correção está preenchido com valor positivo", () => {
      const result = validaCorrecaoCampoVazio({
        statusPeriodo: "MEDICAO_CORRECAO_SOLICITADA",
        rowName: "refeicao",
        dia: "01",
        idCategoria: 1,
        value: "25",
        diasParaCorrecao: defaultDiasParaCorrecao,
      });
      expect(result).toBeUndefined();
    });
  });

  describe("fora do modo correção", () => {
    it("NÃO retorna erro quando status não é de correção", () => {
      const result = validaCorrecaoCampoVazio({
        statusPeriodo: "MEDICAO_APROVADA_PELA_DRE",
        rowName: "frequencia",
        dia: "01",
        idCategoria: 1,
        value: "",
        diasParaCorrecao: defaultDiasParaCorrecao,
      });
      expect(result).toBeUndefined();
    });

    it("NÃO retorna erro quando statusPeriodo é undefined", () => {
      const result = validaCorrecaoCampoVazio({
        statusPeriodo: undefined,
        rowName: "frequencia",
        dia: "01",
        idCategoria: 1,
        value: "",
        diasParaCorrecao: defaultDiasParaCorrecao,
      });
      expect(result).toBeUndefined();
    });
  });

  describe("dia/categoria não é dia de correção", () => {
    it("NÃO retorna erro quando o dia/categoria não está em diasParaCorrecao", () => {
      const result = validaCorrecaoCampoVazio({
        statusPeriodo: "MEDICAO_CORRECAO_SOLICITADA",
        rowName: "frequencia",
        dia: "99",
        idCategoria: 1,
        value: "",
        diasParaCorrecao: defaultDiasParaCorrecao,
      });
      expect(result).toBeUndefined();
    });

    it("NÃO retorna erro quando diasParaCorrecao é undefined", () => {
      const result = validaCorrecaoCampoVazio({
        statusPeriodo: "MEDICAO_CORRECAO_SOLICITADA",
        rowName: "frequencia",
        dia: "01",
        idCategoria: 1,
        value: "",
        diasParaCorrecao: undefined,
      });
      expect(result).toBeUndefined();
    });
  });

  describe("linhas somente-leitura", () => {
    it.each(READ_ONLY_ROWS)(
      "NÃO retorna erro para linha %s (somente-leitura)",
      (rowName) => {
        const result = validaCorrecaoCampoVazio({
          statusPeriodo: "MEDICAO_CORRECAO_SOLICITADA",
          rowName,
          dia: "01",
          idCategoria: 1,
          value: "",
          diasParaCorrecao: defaultDiasParaCorrecao,
        });
        expect(result).toBeUndefined();
      },
    );
  });

  describe("detecção via valoresPeriodosLancamentos", () => {
    it("retorna erro quando valoresPeriodosLancamentos tem habilitado_correcao", () => {
      const result = validaCorrecaoCampoVazio({
        statusPeriodo: "MEDICAO_CORRECAO_SOLICITADA",
        rowName: "lanche",
        dia: "20",
        idCategoria: 3,
        value: "",
        diasParaCorrecao: [],
        valoresPeriodosLancamentos: [
          {
            dia: "20",
            categoria_medicao: 3,
            habilitado_correcao: true,
            nome_campo: "lanche",
          },
        ],
      });
      expect(result).toBe("Preenchimento obrigatório.");
    });
  });

  describe("EMEBS - filtro por aba", () => {
    const emebsDiasParaCorrecao = [
      {
        dia: "01",
        categoria_medicao: 1,
        habilitado_correcao: true,
        infantile_ou_fundamental: "FUNDAMENTAL",
      },
      {
        dia: "01",
        categoria_medicao: 1,
        habilitado_correcao: true,
        infantile_ou_fundamental: "INFANTIL",
      },
    ];

    it("NÃO retorna erro EMEBS quando correção é para aba diferente da selecionada", () => {
      const result = validaCorrecaoCampoVazio({
        statusPeriodo: "MEDICAO_CORRECAO_SOLICITADA",
        rowName: "frequencia",
        dia: "01",
        idCategoria: 1,
        value: "",
        diasParaCorrecao: emebsDiasParaCorrecao,
        escolaEhEMEBS: true,
        alunosTabSelecionada: "FUNDAMENTAL",
      });
      expect(result).toBe("Preenchimento obrigatório.");
    });

    it('retorna erro EMEBS quando correção é para aba "INFANTIL OU FUNDAMENTAL"', () => {
      const dias = [
        {
          dia: "01",
          categoria_medicao: 1,
          habilitado_correcao: true,
          infantile_ou_fundamental: "INFANTIL OU FUNDAMENTAL",
        },
      ];
      const result = validaCorrecaoCampoVazio({
        statusPeriodo: "MEDICAO_CORRECAO_SOLICITADA",
        rowName: "frequencia",
        dia: "01",
        idCategoria: 1,
        value: "",
        diasParaCorrecao: dias,
        escolaEhEMEBS: true,
        alunosTabSelecionada: "FUNDAMENTAL",
      });
      expect(result).toBe("Preenchimento obrigatório.");
    });

    it("NÃO retorna erro EMEBS quando diasParaCorrecao não tem infantile_ou_fundamental", () => {
      const dias = [
        {
          dia: "01",
          categoria_medicao: 1,
          habilitado_correcao: true,
        },
      ];
      const result = validaCorrecaoCampoVazio({
        statusPeriodo: "MEDICAO_CORRECAO_SOLICITADA",
        rowName: "frequencia",
        dia: "01",
        idCategoria: 1,
        value: "",
        diasParaCorrecao: dias,
        escolaEhEMEBS: true,
        alunosTabSelecionada: "FUNDAMENTAL",
      });
      expect(result).toBe("Preenchimento obrigatório.");
    });
  });

  describe("múltiplos status de correção", () => {
    it.each(CORRECTION_STATUSES)(
      "retorna erro no status de correção %s",
      (status) => {
        const result = validaCorrecaoCampoVazio({
          statusPeriodo: status,
          rowName: "frequencia",
          dia: "01",
          idCategoria: 1,
          value: "",
          diasParaCorrecao: defaultDiasParaCorrecao,
        });
        expect(result).toBe("Preenchimento obrigatório.");
      },
    );
  });

  describe("tipos de campos editáveis", () => {
    it.each([
      "frequencia",
      "refeicao",
      "sobremesa",
      "lanche",
      "lanche_4h",
      "lanche_emergencial",
      "kit_lanche",
      "repeticao_refeicao",
      "repeticao_sobremesa",
    ])("retorna erro para campo %s vazio em dia de correção", (rowName) => {
      const result = validaCorrecaoCampoVazio({
        statusPeriodo: "MEDICAO_CORRECAO_SOLICITADA",
        rowName,
        dia: "01",
        idCategoria: 1,
        value: "",
        diasParaCorrecao: defaultDiasParaCorrecao,
      });
      expect(result).toBe("Preenchimento obrigatório.");
    });
  });
});
