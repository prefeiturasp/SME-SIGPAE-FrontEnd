import {
  calcularQuantidadeEstimada,
  calcularQuantidadeEstimadaDisponivel,
  calcularDiferenca,
} from "../components/Cadastrar/helpers";
import {
  EtapaCronograma,
  EtapaMes,
} from "src/interfaces/cronograma_semanal.interface";

describe("calcularQuantidadeEstimada", () => {
  const etapas: EtapaCronograma[] = [
    {
      uuid: "1",
      data_programada: "04/2026",
      quantidade: 31500,
      quantidade_estimada_disponivel: 31500,
    },
    {
      uuid: "2",
      data_programada: "05/2026",
      quantidade: 63000,
      quantidade_estimada_disponivel: 63000,
    },
  ];

  it("retorna quantidade total das etapas do mês", () => {
    const result = calcularQuantidadeEstimada("04/2026", etapas);
    expect(result).toBe(31500);
  });

  it("retorna 0 para mês sem etapas", () => {
    const result = calcularQuantidadeEstimada("01/2026", etapas);
    expect(result).toBe(0);
  });

  it("retorna 0 para mês vazio", () => {
    const result = calcularQuantidadeEstimada("", etapas);
    expect(result).toBe(0);
  });

  it("retorna 0 para etapas vazias", () => {
    const result = calcularQuantidadeEstimada("04/2026", []);
    expect(result).toBe(0);
  });

  it("soma múltiplas etapas do mesmo mês", () => {
    const etapasMultiplas: EtapaCronograma[] = [
      {
        uuid: "1",
        data_programada: "04/2026",
        quantidade: 10000,
        quantidade_estimada_disponivel: 10000,
      },
      {
        uuid: "2",
        data_programada: "04/2026",
        quantidade: 21500,
        quantidade_estimada_disponivel: 21500,
      },
    ];
    const result = calcularQuantidadeEstimada("04/2026", etapasMultiplas);
    expect(result).toBe(31500);
  });
});

describe("calcularQuantidadeEstimadaDisponivel", () => {
  const etapasMeses: EtapaMes[] = [
    {
      mes_ano: "04/2026",
      quantidade_total: 31500,
      quantidade_estimada_disponivel: 31500,
    },
    {
      mes_ano: "05/2026",
      quantidade_total: 63000,
      quantidade_estimada_disponivel: 63000,
    },
  ];

  it("retorna quantidade estimada disponível do mês", () => {
    const result = calcularQuantidadeEstimadaDisponivel("04/2026", etapasMeses);
    expect(result).toBe(31500);
  });

  it("retorna 0 para mês sem dados", () => {
    const result = calcularQuantidadeEstimadaDisponivel("01/2026", etapasMeses);
    expect(result).toBe(0);
  });

  it("retorna 0 para mês vazio", () => {
    const result = calcularQuantidadeEstimadaDisponivel("", etapasMeses);
    expect(result).toBe(0);
  });

  it("retorna 0 para lista vazia", () => {
    const result = calcularQuantidadeEstimadaDisponivel("04/2026", []);
    expect(result).toBe(0);
  });
});

describe("calcularDiferenca", () => {
  const etapasMeses: EtapaMes[] = [
    {
      mes_ano: "04/2026",
      quantidade_total: 31500,
      quantidade_estimada_disponivel: 31500,
    },
    {
      mes_ano: "05/2026",
      quantidade_total: 63000,
      quantidade_estimada_disponivel: 63000,
    },
  ];

  describe("Cenário 1: Um único mês programado", () => {
    it("calcula diferença correta para quantidade inferior à estimada", () => {
      const programacoes = [
        {
          mes_programado: "04/2026",
          data_inicio: "01/04/2026",
          data_fim: "30/04/2026",
          quantidade: "10000",
        },
      ];
      const result = calcularDiferenca("04/2026", programacoes, etapasMeses);
      // 31500 - 10000 = 21500
      expect(result).toBe(21500);
    });

    it("calcula diferença zero para quantidade igual à estimada", () => {
      const programacoes = [
        {
          mes_programado: "04/2026",
          data_inicio: "01/04/2026",
          data_fim: "30/04/2026",
          quantidade: "31500",
        },
      ];
      const result = calcularDiferenca("04/2026", programacoes, etapasMeses);
      expect(result).toBe(0);
    });
  });

  describe("Cenário 2: Meses diferentes não são somados", () => {
    it("retorna diferença individual para cada mês, sem somar valores de meses diferentes", () => {
      const programacoes = [
        {
          mes_programado: "04/2026",
          data_inicio: "01/04/2026",
          data_fim: "30/04/2026",
          quantidade: "10000",
        },
        {
          mes_programado: "05/2026",
          data_inicio: "01/05/2026",
          data_fim: "31/05/2026",
          quantidade: "15000",
        },
      ];

      const diffAbril = calcularDiferenca("04/2026", programacoes, etapasMeses);
      // 31500 - 10000 = 21500 (não soma 05/2026)
      expect(diffAbril).toBe(21500);

      const diffMaio = calcularDiferenca("05/2026", programacoes, etapasMeses);
      // 63000 - 15000 = 48000 (não soma 04/2026)
      expect(diffMaio).toBe(48000);
    });
  });

  describe("Cenário 3: Mesmo mês em múltiplas linhas", () => {
    it("soma quantidades informadas do mesmo mês na diferença", () => {
      const programacoes = [
        {
          mes_programado: "04/2026",
          data_inicio: "01/04/2026",
          data_fim: "15/04/2026",
          quantidade: "10000",
        },
        {
          mes_programado: "04/2026",
          data_inicio: "16/04/2026",
          data_fim: "30/04/2026",
          quantidade: "5000",
        },
      ];

      const result = calcularDiferenca("04/2026", programacoes, etapasMeses);
      // 31500 - (10000 + 5000) = 16500
      expect(result).toBe(16500);
    });
  });

  describe("Edge cases", () => {
    it("retorna valor estimado quando não há programações para o mês", () => {
      const programacoes = [
        {
          mes_programado: "05/2026",
          data_inicio: "01/05/2026",
          data_fim: "31/05/2026",
          quantidade: "10000",
        },
      ];
      const result = calcularDiferenca("04/2026", programacoes, etapasMeses);
      // 31500 - 0 = 31500
      expect(result).toBe(31500);
    });

    it("retorna 0 para programacoes vazias", () => {
      const etapasMesesVazias: EtapaMes[] = [];
      const result = calcularDiferenca("04/2026", [], etapasMesesVazias);
      expect(result).toBe(0);
    });

    it("lida com formato de quantidade com milhar", () => {
      const programacoes = [
        {
          mes_programado: "04/2026",
          data_inicio: "01/04/2026",
          data_fim: "30/04/2026",
          quantidade: "10.000",
        },
      ];
      const result = calcularDiferenca("04/2026", programacoes, etapasMeses);
      // 31500 - 10000 = 21500
      expect(result).toBe(21500);
    });

    it("retorna diferença negativa quando informado acima do estimado", () => {
      const programacoes = [
        {
          mes_programado: "04/2026",
          data_inicio: "01/04/2026",
          data_fim: "30/04/2026",
          quantidade: "50000",
        },
      ];
      const result = calcularDiferenca("04/2026", programacoes, etapasMeses);
      // 31500 - 50000 = -18500
      expect(result).toBe(-18500);
    });
  });
});
