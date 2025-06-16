import {
  possuiAlunosCEIporPeriodo,
  alunosEMEIporPeriodo,
  tiposAlimentacaoPorPeriodoETipoUnidade,
  arrTiposAlimentacaoPorPeriodoETipoUnidade,
  totalAlunosPorPeriodoCEI,
  totalAlunosInputPorPeriodoCEI,
  formataInclusaoCEMEI,
  tiposAlimentacaoMotivoEspecifico,
  validarSubmit,
} from "../helpers";

afterEach(() => {
  jest.clearAllMocks();
});

describe("Funções helpers.js", () => {
  test("possuiAlunosCEIporPeriodo retorna true quando há alunos CEI", () => {
    const periodos = [{ nome: "Manhã", CEI: [{ quantidade_alunos: 5 }] }];
    expect(possuiAlunosCEIporPeriodo("Manhã", periodos)).toBe(true);
  });

  test("alunosEMEIporPeriodo retorna corretamente alunos EMEI", () => {
    const periodos = [{ nome: "Tarde", EMEI: 10 }];
    expect(alunosEMEIporPeriodo("Tarde", periodos)).toBe(10);
  });

  test("tiposAlimentacaoPorPeriodoETipoUnidade retorna string filtrada", () => {
    const vinculos = [
      {
        periodo_escolar: { nome: "Integral" },
        tipo_unidade_escolar: { iniciais: "CEI" },
        tipos_alimentacao: [{ nome: "Almoço" }, { nome: "LANCHE EMERGENCIAL" }],
      },
    ];
    expect(
      tiposAlimentacaoPorPeriodoETipoUnidade(vinculos, "Integral", "CEI")
    ).toBe("Almoço");
  });

  test("arrTiposAlimentacaoPorPeriodoETipoUnidade retorna array sem lanche emergencial", () => {
    const vinculos = [
      {
        periodo_escolar: { nome: "Integral" },
        tipo_unidade_escolar: { iniciais: "CEI" },
        tipos_alimentacao: [{ nome: "Almoço" }, { nome: "LANCHE EMERGENCIAL" }],
      },
    ];
    expect(
      arrTiposAlimentacaoPorPeriodoETipoUnidade(vinculos, "Integral", "CEI")
    ).toEqual([{ nome: "Almoço" }]);
  });

  test("totalAlunosPorPeriodoCEI soma corretamente", () => {
    const periodos = [
      {
        nome: "Manhã",
        CEI: [{ quantidade_alunos: 5 }, { quantidade_alunos: 10 }],
      },
    ];
    expect(totalAlunosPorPeriodoCEI(periodos, "Manhã")).toBe(15);
  });

  test("totalAlunosInputPorPeriodoCEI calcula corretamente", () => {
    const values = {
      quantidades_periodo: [{ nome: "Manhã", faixas: { 1: "3", 2: "7" } }],
    };
    expect(totalAlunosInputPorPeriodoCEI(values, "Manhã")).toBe(10);
  });

  test("formataInclusaoCEMEI formata os dados", () => {
    const values = {
      inclusoes: [{ inclusao_alimentacao_cemei: true }],
      quantidades_periodo: [
        {
          nome: "Manhã",
          checked: true,
          faixas: { 1: 5 },
          CEI: [{ faixa: "1", quantidade_alunos: 10, uuid: "uuid-cei" }],
          alunos_emei: 8,
          EMEI: 9,
          tipos_alimentacao_selecionados: ["Almoço"],
        },
      ],
    };
    const vinculos = [
      { periodo_escolar: { nome: "Manhã", uuid: "uuid-periodo" } },
    ];
    const result = formataInclusaoCEMEI(values, vinculos);
    expect(result.quantidade_alunos_cei_da_inclusao_cemei.length).toBe(1);
    expect(result.quantidade_alunos_emei_da_inclusao_cemei.length).toBe(1);
  });

  test("tiposAlimentacaoMotivoEspecifico concatena os nomes", () => {
    const periodo = {
      tipos_alimentacao: [{ nome: "Almoço" }, { nome: "Janta" }],
    };
    expect(tiposAlimentacaoMotivoEspecifico(periodo)).toBe("Almoço, Janta");
  });

  test("validarSubmit retorna erro se nenhum período for marcado", () => {
    const values = { quantidades_periodo: [{ checked: false }] };
    expect(validarSubmit(values)).toBe(
      "Necessário selecionar e preencher ao menos um período"
    );
  });

  test("validarSubmit retorna erro se período marcado mas incompleto", () => {
    const values = {
      quantidades_periodo: [{ checked: true, faixas: null, alunos_emei: null }],
    };
    expect(validarSubmit(values)).toBe(
      "Ao selecionar um período, preencher ao menos uma quantidade de alunos"
    );
  });

  test("validarSubmit retorna false quando tudo está preenchido corretamente", () => {
    const values = {
      quantidades_periodo: [
        {
          checked: true,
          faixas: { 1: 5 },
          CEI: [{ faixa: "1", quantidade_alunos: 10, uuid: "uuid" }],
          alunos_emei: 8,
          tipos_alimentacao_selecionados: ["Almoço"],
        },
      ],
    };
    expect(validarSubmit(values)).toBe(false);
  });
});
