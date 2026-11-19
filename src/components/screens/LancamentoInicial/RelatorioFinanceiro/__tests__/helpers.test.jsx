import {
  calcularFaturamentoFinal,
  chaveCampoConsumo,
  obterValorFaixa,
  chaveLinhaTipoAlimentacao,
  formataPercentual,
  listaAlimentacoes,
  montarResumoDescontos,
  obterValorParametrizado,
  prioridadeAlimentacao,
  tituloFaturamentoFinal,
} from "../helpers";

describe("Helpers - Relatório Financeiro", () => {
  describe("formataPercentual", () => {
    it("formata inteiros e decimais no padrão brasileiro", () => {
      expect(formataPercentual(5)).toBe("5%");
      expect(formataPercentual(2.5)).toBe("2,5%");
      expect(formataPercentual(12.346)).toBe("12,35%");
    });

    it("trata ausência de valor como 0%", () => {
      expect(formataPercentual(null)).toBe("0%");
      expect(formataPercentual(undefined)).toBe("0%");
    });
  });

  describe("chaveCampoConsumo", () => {
    it("remove acentos, normaliza caixa e troca espaços por underscore", () => {
      expect(chaveCampoConsumo("Refeição")).toBe("refeicao");
      expect(chaveCampoConsumo("Lanche 4h")).toBe("lanche_4h");
      expect(chaveCampoConsumo("Kit Lanche")).toBe("kit_lanche");
      expect(chaveCampoConsumo("Lanche  Emergencial")).toBe(
        "lanche_emergencial",
      );
    });
  });

  describe("chaveLinhaTipoAlimentacao", () => {
    it("diferencia tipos com o mesmo uuid pelo tipo de refeição", () => {
      expect(
        chaveLinhaTipoAlimentacao({ uuid: "x", nome: "Refeição" }),
      ).not.toBe(
        chaveLinhaTipoAlimentacao({
          uuid: "x",
          nome: "Refeição EJA",
          tipo_refeicao: "eja",
        }),
      );
    });
  });

  describe("obterValorParametrizado", () => {
    const tabela = {
      nome: "Preço das Alimentações",
      periodo_escolar: null,
      valores: [
        {
          tipo_alimentacao: { uuid: "a" },
          tipo_valor: "UNITARIO",
          valor: "9,54",
        },
        {
          tipo_alimentacao: { uuid: "a" },
          tipo_valor: "REAJUSTE",
          valor: "0,16",
        },
      ],
    };

    it("retorna o valor cadastrado sem perda de precisão", () => {
      const tipo = { uuid: "a", nome: "Lanche" };

      expect(obterValorParametrizado(tabela, tipo, "UNITARIO")).toBe(9.54);
      expect(obterValorParametrizado(tabela, tipo, "REAJUSTE")).toBe(0.16);
    });

    it("retorna 0 quando não há tabela ou valor cadastrado", () => {
      const tipo = { uuid: "a", nome: "Lanche" };

      expect(obterValorParametrizado(undefined, tipo, "UNITARIO")).toBe(0);
      expect(obterValorParametrizado(tabela, tipo, "ACRESCIMO")).toBe(0);
    });
  });

  describe("obterValorFaixa", () => {
    const tabela = {
      nome: "Preço das Alimentações",
      periodo_escolar: "INTEGRAL",
      valores: [
        {
          faixa_etaria: { uuid: "faixa-1" },
          tipo_valor: "UNITARIO",
          valor: "9,54",
        },
        {
          faixa_etaria: { uuid: "faixa-1" },
          tipo_valor: "REAJUSTE",
          valor: "0,16",
        },
      ],
    };

    it("retorna o valor da faixa e do tipo pedidos", () => {
      expect(obterValorFaixa(tabela, "faixa-1", "UNITARIO")).toBe(9.54);
      expect(obterValorFaixa(tabela, "faixa-1", "REAJUSTE")).toBe(0.16);
    });

    it("retorna 0 quando a faixa ou a tabela não existem", () => {
      expect(obterValorFaixa(tabela, "outra-faixa", "UNITARIO")).toBe(0);
      expect(obterValorFaixa(undefined, "faixa-1", "UNITARIO")).toBe(0);
    });
  });

  describe("listaAlimentacoes", () => {
    it("TIPO A sem cieja deve retornar refeicao, lanche e lanche 4h", () => {
      const result = listaAlimentacoes("TIPO A", false);

      expect(result).toEqual(["refeicao", "lanche", "lanche 4h"]);
    });

    it("TIPO A com cieja deve retornar refeicao e lanche 4h", () => {
      const result = listaAlimentacoes("TIPO A", true);

      expect(result).toEqual(["refeicao", "lanche 4h"]);
    });

    it("TIPO diferente de A sem cieja deve retornar lanche e lanche 4h", () => {
      const result = listaAlimentacoes("TIPO B", false);

      expect(result).toEqual(["lanche", "lanche 4h"]);
    });

    it("TIPO diferente de A com cieja deve retornar apenas lanche 4h", () => {
      const result = listaAlimentacoes("TIPO B", true);

      expect(result).toEqual(["lanche 4h"]);
    });
  });

  describe("prioridadeAlimentacao", () => {
    it("deve retornar 0 para refeicao", () => {
      expect(prioridadeAlimentacao("Refeição")).toBe(0);
    });

    it("deve retornar 1 para refeicao cieja e cmct", () => {
      expect(prioridadeAlimentacao("Refeição CIEJA e CMCT")).toBe(1);
    });

    it("deve retornar 2 para refeicao eja", () => {
      expect(prioridadeAlimentacao("Refeição EJA")).toBe(2);
    });

    it("deve retornar 99 para outros tipos", () => {
      expect(prioridadeAlimentacao("Lanche")).toBe(3);
      expect(prioridadeAlimentacao("Refeição da Tarde")).toBe(99);
      expect(prioridadeAlimentacao("Outro Tipo")).toBe(99);
    });

    it("deve ignorar caixa alta/baixa e acentos", () => {
      expect(prioridadeAlimentacao("REFEICAO")).toBe(0);
      expect(prioridadeAlimentacao("refeicao cieja")).toBe(1);
      expect(prioridadeAlimentacao("refeicao eja")).toBe(2);
    });
  });
});

const FAIXA = { uuid: "uuid-faixa", __str__: "04 a 05 meses" };
const REFEICAO = { uuid: "uuid-refeicao", nome: "Refeição" };
const LANCHE = { uuid: "uuid-lanche", nome: "Lanche" };

const clausula = (porcentagem = "50.00", item = "item a") => ({
  uuid: `uuid-clausula-${porcentagem}`,
  numero_clausula: "7.2.2",
  item_clausula: item,
  porcentagem_desconto: porcentagem,
});

const valor = (nome_campo, valorCampo, tipo_valor = "UNITARIO") => ({
  nome_campo,
  tipo_valor,
  valor: valorCampo,
});

const tabela = (nome, valores, periodo_escolar = null) => ({
  nome,
  periodo_escolar,
  valores,
});

const relatorio = (grupo, tabelas) => ({
  grupo_unidade_escolar: { nome: grupo },
  tabelas,
});

let sequenciaDesconto = 0;

const desconto = (dados) => ({
  uuid: `uuid-desconto-${++sequenciaDesconto}`,
  unidades_educacionais: [{ uuid: "uuid-escola", nome: "UNIDADE A" }],
  tipo_lancamento: "ALIMENTACOES",
  tipo_alimentacao: null,
  faixa_etaria: null,
  periodo_escolar: null,
  cei_ou_emei: "N/A",
  infantil_ou_fundamental: "N/A",
  clausula_desconto: clausula(),
  quantidade: 1,
  ...dados,
});

const montar = (relatorioConsolidado, descontos) =>
  montarResumoDescontos({
    descontos,
    relatorioConsolidado,
    faixasEtarias: [FAIXA],
    tiposAlimentacao: [REFEICAO, LANCHE],
  });

const resumoLinhas = (resumo) =>
  resumo.linhas.map(
    ({ tipoLancamento, faixaOuAlimentacao, valorUnitario, total }) => ({
      tipoLancamento,
      faixaOuAlimentacao,
      valorUnitario,
      total,
    }),
  );

const TABELAS_EMEI = [
  tabela("Preço das Alimentações", [
    valor("lanche", "6,00"),
    valor("lanche", "1,00", "REAJUSTE"),
    valor("refeição", "10,00"),
    valor("kit_lanche", "3,50"),
  ]),
  tabela("Dietas Tipo A e Tipo A Enteral/Restrição de Aminoácidos", [
    valor("refeição", "12,00"),
    valor("refeição", "50", "ACRESCIMO"),
  ]),
];

describe("montarResumoDescontos", () => {
  it("Grupo 1 (CEI): usa a faixa etária e o período, sem reajuste nem acréscimo", () => {
    const resumo = montar(
      relatorio("Grupo 1", [
        tabela(
          "Preço das Alimentações",
          [
            valor("04_a_05_meses", "9,70"),
            valor("04_a_05_meses", "1,00", "REAJUSTE"),
          ],
          "INTEGRAL",
        ),
        tabela(
          "Dietas Tipo B",
          [
            valor("04_a_05_meses", "12,00"),
            valor("04_a_05_meses", "20", "ACRESCIMO"),
          ],
          "PARCIAL",
        ),
      ]),
      [
        desconto({
          faixa_etaria: FAIXA,
          periodo_escolar: "INTEGRAL",
          quantidade: 3,
        }),
        desconto({
          tipo_lancamento: "DIETAS_TIPO_B",
          faixa_etaria: FAIXA,
          periodo_escolar: "PARCIAL",
          quantidade: 2,
          clausula_desconto: clausula("10.00"),
        }),
      ],
    );

    expect(resumo.tituloFaixaOuAlimentacao).toBe("FAIXA ETÁRIA");
    expect(resumoLinhas(resumo)).toEqual([
      {
        tipoLancamento: "ALIMENTAÇÃO",
        faixaOuAlimentacao: "Integral - 04 a 05 meses",
        valorUnitario: 9.7,
        total: 14.55,
      },
      {
        tipoLancamento: "DIETA ESPECIAL TIPO B",
        faixaOuAlimentacao: "Parcial - 04 a 05 meses",
        valorUnitario: 12,
        total: 2.4,
      },
    ]);
    expect(resumo.total).toBe(16.95);
  });

  it("Grupo 2 (CEMEI): busca o valor na turma do desconto e acrescenta o sufixo", () => {
    const resumo = montar(
      relatorio("Grupo 2", [
        tabela(
          "Preço das Alimentações",
          [valor("04_a_05_meses", "9,70")],
          "INTEGRAL",
        ),
        tabela("Preço das Alimentações - Turma Infantil - EMEI", [
          valor("refeição", "11,00"),
        ]),
      ]),
      [
        desconto({
          cei_ou_emei: "CEI",
          faixa_etaria: FAIXA,
          periodo_escolar: "INTEGRAL",
          quantidade: 3,
        }),
        desconto({
          cei_ou_emei: "EMEI",
          tipo_alimentacao: REFEICAO,
          quantidade: 4,
        }),
      ],
    );

    expect(resumo.tituloFaixaOuAlimentacao).toBe("FAIXA ETÁRIA OU ALIMENTAÇÃO");
    expect(resumoLinhas(resumo)).toEqual([
      {
        tipoLancamento: "ALIMENTAÇÃO - CEI",
        faixaOuAlimentacao: "Integral - 04 a 05 meses",
        valorUnitario: 9.7,
        total: 14.55,
      },
      {
        tipoLancamento: "ALIMENTAÇÃO - EMEI",
        faixaOuAlimentacao: "REFEIÇÃO",
        valorUnitario: 11,
        total: 22,
      },
    ]);
    expect(resumo.total).toBe(36.55);
  });

  it("Grupo 3 (EMEI): alimentação, dieta tipo A e kit lanche", () => {
    const resumo = montar(relatorio("Grupo 3", TABELAS_EMEI), [
      desconto({ tipo_alimentacao: LANCHE, quantidade: 10 }),
      desconto({
        tipo_lancamento: "DIETAS_TIPO_A",
        tipo_alimentacao: REFEICAO,
        quantidade: 5,
      }),
      desconto({ quantidade: 2 }),
    ]);

    expect(resumo.tituloFaixaOuAlimentacao).toBe("ALIMENTAÇÃO");
    expect(resumoLinhas(resumo)).toEqual([
      {
        tipoLancamento: "ALIMENTAÇÃO",
        faixaOuAlimentacao: "LANCHE",
        valorUnitario: 6,
        total: 30,
      },
      {
        tipoLancamento: "DIETA ESPECIAL TIPO A",
        faixaOuAlimentacao: "REFEIÇÃO",
        valorUnitario: 12,
        total: 30,
      },
      {
        tipoLancamento: "ALIMENTAÇÃO",
        faixaOuAlimentacao: "KIT LANCHE",
        valorUnitario: 3.5,
        total: 3.5,
      },
    ]);
    expect(resumo.total).toBe(63.5);
  });

  it("Grupo 4 (EMEF): diferencia refeição e refeição EJA na tabela sem período", () => {
    const resumo = montar(
      relatorio("Grupo 4", [
        tabela("Preço das Alimentações", [
          valor("refeição_-_ceu_emef,_ceu_gestão,_emef,_emefm", "21,00"),
          valor("refeição_-_eja", "25,00"),
        ]),
      ]),
      [
        desconto({
          tipo_alimentacao: REFEICAO,
          quantidade: 5,
          clausula_desconto: clausula("100.00", "item c"),
        }),
        desconto({
          tipo_alimentacao: REFEICAO,
          periodo_escolar: "NOITE",
          quantidade: 2,
          clausula_desconto: clausula("100.00", "item c"),
        }),
      ],
    );

    expect(resumoLinhas(resumo)).toEqual([
      {
        tipoLancamento: "ALIMENTAÇÃO",
        faixaOuAlimentacao: "REFEIÇÃO",
        valorUnitario: 21,
        total: 105,
      },
      {
        tipoLancamento: "ALIMENTAÇÃO",
        faixaOuAlimentacao: "REFEIÇÃO - EJA",
        valorUnitario: 25,
        total: 50,
      },
    ]);
    expect(resumo.linhas[0].clausula).toBe("7.2.2. item c - (100%)");
    expect(resumo.total).toBe(155);
  });

  it("Grupo 5 (EMEBS): usa a tabela da turma e acrescenta INFANTIL ou FUNDAMENTAL", () => {
    const resumo = montar(
      relatorio("Grupo 5", [
        tabela("Preço das Alimentações - EMEBS Infantil", [
          valor("lanche", "4,00"),
        ]),
        tabela("Preço das Alimentações - EMEBS Fundamental", [
          valor("lanche", "5,00"),
        ]),
      ]),
      [
        desconto({
          infantil_ou_fundamental: "INFANTIL",
          tipo_alimentacao: LANCHE,
          quantidade: 2,
        }),
        desconto({
          infantil_ou_fundamental: "FUNDAMENTAL",
          tipo_alimentacao: LANCHE,
          quantidade: 2,
        }),
      ],
    );

    expect(resumoLinhas(resumo)).toEqual([
      {
        tipoLancamento: "ALIMENTAÇÃO - INFANTIL",
        faixaOuAlimentacao: "LANCHE",
        valorUnitario: 4,
        total: 4,
      },
      {
        tipoLancamento: "ALIMENTAÇÃO - FUNDAMENTAL",
        faixaOuAlimentacao: "LANCHE",
        valorUnitario: 5,
        total: 5,
      },
    ]);
  });

  it("Grupo 6 (CIEJA): exibe a refeição como REFEIÇÃO CIEJA E CMCT", () => {
    const resumo = montar(
      relatorio("Grupo 6", [
        tabela("Preço das Alimentações", [valor("refeição", "8,00")]),
      ]),
      [desconto({ tipo_alimentacao: REFEICAO, quantidade: 1 })],
    );

    expect(resumo.linhas[0].faixaOuAlimentacao).toBe("REFEIÇÃO CIEJA E CMCT");
    expect(resumo.linhas[0].valorUnitario).toBe(8);
  });

  it("arredonda cada linha meio para cima e soma as linhas arredondadas", () => {
    const relatorioEmei = relatorio("Grupo 3", [
      tabela("Preço das Alimentações", [valor("lanche", "9,71")]),
    ]);
    const resumo = montar(relatorioEmei, [
      desconto({ tipo_alimentacao: LANCHE, quantidade: 1 }),
      desconto({ tipo_alimentacao: LANCHE, quantidade: 1 }),
    ]);

    expect(resumo.linhas.map(({ total }) => total)).toEqual([4.86, 4.86]);
    expect(resumo.total).toBe(9.72);
  });

  it("aceita porcentagem com casas decimais", () => {
    const resumo = montar(
      relatorio("Grupo 3", [
        tabela("Preço das Alimentações", [valor("lanche", "9,99")]),
      ]),
      [
        desconto({
          tipo_alimentacao: LANCHE,
          quantidade: 3,
          clausula_desconto: clausula("12.50", "item b"),
        }),
      ],
    );

    expect(resumo.linhas[0].clausula).toBe("7.2.2. item b - (12,5%)");
    expect(resumo.linhas[0].total).toBe(3.75);
  });

  it("lista as unidades na mesma ordem do PDF", () => {
    const resumo = montar(relatorio("Grupo 3", TABELAS_EMEI), [
      desconto({
        tipo_alimentacao: LANCHE,
        unidades_educacionais: [
          { uuid: "1", nome: "EMEI CARLOS" },
          { uuid: "2", nome: "EMEI ANA" },
          { uuid: "3", nome: "EMEI BRUNO" },
        ],
      }),
    ]);

    expect(resumo.linhas).toHaveLength(1);
    expect(resumo.linhas[0].unidades).toEqual([
      "EMEI ANA",
      "EMEI BRUNO",
      "EMEI CARLOS",
    ]);
  });

  it("usa valor unitário 0 quando não encontra a parametrização", () => {
    const resumo = montar(relatorio("Grupo 3", []), [
      desconto({ tipo_alimentacao: LANCHE, quantidade: 10 }),
    ]);

    expect(resumo.linhas[0].valorUnitario).toBe(0);
    expect(resumo.total).toBe(0);
  });

  it.each([
    ["sem descontos", relatorio("Grupo 3", TABELAS_EMEI), [], [FAIXA]],
    [
      "com descontos indefinidos",
      relatorio("Grupo 3", TABELAS_EMEI),
      undefined,
      [FAIXA],
    ],
    [
      "sem relatório carregado",
      undefined,
      [desconto({ tipo_alimentacao: LANCHE })],
      [FAIXA],
    ],
    [
      "sem faixas etárias carregadas",
      relatorio("Grupo 1", []),
      [desconto({ faixa_etaria: FAIXA, periodo_escolar: "INTEGRAL" })],
      [],
    ],
  ])(
    "retorna lista vazia %s",
    (_, relatorioConsolidado, descontos, faixasEtarias) => {
      const resumo = montarResumoDescontos({
        descontos,
        relatorioConsolidado,
        faixasEtarias,
        tiposAlimentacao: [LANCHE],
      });

      expect(resumo.linhas).toEqual([]);
      expect(resumo.total).toBe(0);
    },
  );
});

describe("calcularFaturamentoFinal", () => {
  it("subtrai os descontos do faturamento total em centavos", () => {
    expect(calcularFaturamentoFinal(154888.2, 121.25)).toBe(154766.95);
  });

  it("arredonda o faturamento total meio para cima antes de subtrair", () => {
    expect(calcularFaturamentoFinal(1000.005, 0.01)).toBe(1000);
  });
});

describe("tituloFaturamentoFinal", () => {
  it.each([
    ["CONSOLIDADO TOTAL (A + B + C)", "A + B + C"],
    [
      "CONSOLIDADO TOTAL (A + B + C + INF. A + INF. B + INF. C)",
      "A + B + C + INF. A + INF. B + INF. C",
    ],
    [
      "CONSOLIDADO TOTAL (INF. A + INF. B + INF. C + FUND. A + FUND. B + FUND. C)",
      "INF. A + INF. B + INF. C + FUND. A + FUND. B + FUND. C",
    ],
  ])("monta o título a partir de %s", (titulo, soma) => {
    expect(tituloFaturamentoFinal(titulo)).toBe(
      `VALOR DO FATURAMENTO FINAL (${soma} - D):`,
    );
  });
});
