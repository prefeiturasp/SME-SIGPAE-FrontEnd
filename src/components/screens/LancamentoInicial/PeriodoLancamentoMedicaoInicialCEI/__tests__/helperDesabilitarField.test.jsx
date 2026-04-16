import { desabilitarField } from "src/components/screens/LancamentoInicial/PeriodoLancamentoMedicaoInicialCEI/helper.jsx";

describe("desabilitarField CEI/CEMEI", () => {
  const baseArgs = () => ({
    dia: 1,
    rowName: "frequencia",
    categoria: 1,
    nomeCategoria: "ALIMENTAÇÃO",
    values: {
      frequencia__dia_1__categoria_1: "10",
      frequencia__faixa_1__dia_1__categoria_1: "10",
      matriculados__faixa_1__dia_1__categoria_1: "10",
      dietas_autorizadas__faixa_1__dia_1__categoria_1: "5",
      matriculados__dia_1__categoria_1: "10",
      dietas_autorizadas__dia_1__categoria_1: "5",
    },
    mesAnoConsiderado: new Date("2023-10-01"),
    mesAnoDefault: new Date("2023-10-01"),
    inclusoesAutorizadas: [{ dia: 1, alimentacoes: "lanche, refeicao" }],
    validacaoDiaLetivo: jest.fn(() => true),
    validacaoSemana: jest.fn(() => false),
    location: {
      state: { status_periodo: "MEDICAO_EM_ABERTO_PARA_PREENCHIMENTO_UE" },
    },
    valoresPeriodosLancamentos: [],
    feriadosNoMes: [],
    uuidFaixaEtaria: 1,
    diasParaCorrecao: [],
    ehEmeiDaCemeiLocation: false,
    ehSolicitacoesAlimentacaoLocation: false,
    permissoesLancamentosEspeciaisPorDia: [],
    alimentacoesLancamentosEspeciais: [],
    ehProgramasEProjetosLocation: false,
    dadosValoresInclusoesAutorizadasState: {},
    kitLanchesAutorizadas: [],
    alteracoesAlimentacaoAutorizadas: [],
    ehUltimoDiaLetivoDoAno: jest.fn(() => false),
    calendarioMesConsiderado: [{ dia: 1 }],
    ehRecreioNasFerias: false,
    categoriasDeMedicao: [{ id: 1, nome: "ALIMENTAÇÃO" }],
  });

  const call = (a) =>
    desabilitarField(
      a.dia,
      a.rowName,
      a.categoria,
      a.nomeCategoria,
      a.values,
      a.mesAnoConsiderado,
      a.mesAnoDefault,
      a.inclusoesAutorizadas,
      a.validacaoDiaLetivo,
      a.validacaoSemana,
      a.location,
      a.valoresPeriodosLancamentos,
      a.feriadosNoMes,
      a.uuidFaixaEtaria,
      a.diasParaCorrecao,
      a.ehEmeiDaCemeiLocation,
      a.ehSolicitacoesAlimentacaoLocation,
      a.permissoesLancamentosEspeciaisPorDia,
      a.alimentacoesLancamentosEspeciais,
      a.ehProgramasEProjetosLocation,
      a.dadosValoresInclusoesAutorizadasState,
      a.kitLanchesAutorizadas,
      a.alteracoesAlimentacaoAutorizadas,
      a.ehUltimoDiaLetivoDoAno,
      a.calendarioMesConsiderado,
      a.ehRecreioNasFerias,
      a.categoriasDeMedicao,
    );

  it("deve desabilitar quando valor é mês anterior", () => {
    // cenário: bloqueio direto por mês anterior
    const a = baseArgs();
    a.values["frequencia__dia_1__categoria_1"] = "Mês anterior";
    expect(call(a)).toBe(true);
  });

  it("deve desabilitar por status aprovado", () => {
    // cenário: status bloqueado
    const a = baseArgs();
    a.location.state.status_periodo = "MEDICAO_APROVADA_PELA_DRE";
    expect(call(a)).toBe(true);
  });

  it("deve permitir quando inclusão válida alimentação", () => {
    // cenário: inclusão autorizada válida
    const a = baseArgs();
    expect(call(a)).toBe(false);
  });

  it("deve desabilitar quando recreio e fim de semana sem inclusão", () => {
    // cenário: recreio + fim de semana
    const a = baseArgs();
    a.ehRecreioNasFerias = true;
    a.inclusoesAutorizadas = [];
    a.feriadosNoMes = [1];
    expect(call(a)).toBe(true);
  });

  it("deve desabilitar dieta quando não há valor", () => {
    // cenário: dieta sem valor
    const a = baseArgs();
    a.nomeCategoria = "DIETA ESPECIAL";
    a.values["dietas_autorizadas__faixa_1__dia_1__categoria_1"] = 0;
    expect(call(a)).toBe(true);
  });

  it("deve bloquear quando não há inclusão em programas", () => {
    // cenário: programas sem inclusão
    const a = baseArgs();
    a.ehProgramasEProjetosLocation = true;
    a.inclusoesAutorizadas = [];
    expect(call(a)).toBe(true);
  });

  it("deve permitir alimentação especial válida", () => {
    // cenário: alimentação especial permitida
    const a = baseArgs();
    a.permissoesLancamentosEspeciaisPorDia = [
      { dia: 1, alimentacoes: ["frequencia"] },
    ];
    a.alimentacoesLancamentosEspeciais = ["frequencia"];
    expect(call(a)).toBe(false);
  });

  it("deve bloquear alimentação especial fora do dia", () => {
    // cenário: alimentação especial não permitida
    const a = baseArgs();

    a.nomeCategoria = "ALIMENTAÇÃO";
    a.rowName = "frequencia";

    a.ehProgramasEProjetosLocation = true;

    a.permissoesLancamentosEspeciaisPorDia = [{ dia: 1, alimentacoes: [] }];

    a.alimentacoesLancamentosEspeciais = ["frequencia"];

    expect(call(a)).toBe(true);
  });

  it("deve desabilitar solicitações sem autorização", () => {
    // cenário: kit_lanche não autorizado
    const a = baseArgs();
    a.nomeCategoria = "SOLICITAÇÕES";
    a.rowName = "kit_lanche";
    expect(call(a)).toBe(true);
  });

  it("deve permitir solicitações quando autorizado", () => {
    // cenário: kit autorizado
    const a = baseArgs();
    a.nomeCategoria = "SOLICITAÇÕES";
    a.rowName = "kit_lanche";
    a.kitLanchesAutorizadas = [{ dia: 1 }];
    expect(call(a)).toBe(false);
  });

  it("deve desabilitar quando não é dia letivo", () => {
    // cenário: dia inválido
    const a = baseArgs();

    a.validacaoDiaLetivo = jest.fn(() => false);
    a.inclusoesAutorizadas = [];
    a.permissoesLancamentosEspeciaisPorDia = null;
    a.alimentacoesLancamentosEspeciais = [];

    expect(call(a)).toBe(true);
  });

  it("deve permitir frequência no fluxo final", () => {
    // cenário: fluxo final válido
    const a = baseArgs();
    expect(call(a)).toBe(false);
  });

  it("deve desabilitar quando está em correção e dia não pode corrigir", () => {
    // cenário: correção ativa mas dia inválido
    const a = baseArgs();

    a.location.state.status_periodo = "MEDICAO_CORRECAO_SOLICITADA";
    a.diasParaCorrecao = []; // força false

    expect(call(a)).toBe(true);
  });

  it("deve desabilitar em escola CEMEI sem valores obrigatórios", () => {
    // cenário: escola tipo CEMEI sem matriculados
    const a = baseArgs();

    a.location.state = {
      ...a.location.state,
      escola: "CEMEI TESTE",
      periodo: "INTEGRAL",
    };

    a.values["matriculados__faixa_1__dia_1__categoria_1"] = null;

    expect(call(a)).toBe(true);
  });

  it("deve desabilitar quando rowName é numero_de_alunos no bloco final", () => {
    // cenário: campo explicitamente bloqueado
    const a = baseArgs();

    a.rowName = "numero_de_alunos";

    expect(call(a)).toBe(true);
  });

  it("deve desabilitar lanche emergencial quando não autorizado", () => {
    // cenário: lanche emergencial não autorizado
    const a = baseArgs();

    a.nomeCategoria = "SOLICITAÇÕES";
    a.rowName = "lanche_emergencial";

    expect(call(a)).toBe(true);
  });

  it("deve desabilitar dieta em programas quando valor é nulo", () => {
    // cenário: dieta sem valor
    const a = baseArgs();

    a.ehProgramasEProjetosLocation = true;
    a.nomeCategoria = "DIETA ESPECIAL";

    a.values["dietas_autorizadas__dia_1__categoria_1"] = null;

    expect(call(a)).toBe(true);
  });

  it("deve permitir quando está em correção e dia pode corrigir", () => {
    // cenário: correção ativa com dia válido
    const a = baseArgs();

    a.location.state.status_periodo = "MEDICAO_CORRECAO_SOLICITADA";

    a.diasParaCorrecao = [
      { dia: 1, categoria_medicao: 1, habilitado_correcao: true },
    ];

    expect(call(a)).toBe(false);
  });

  it("deve desabilitar solicitações quando dia é futuro no mês atual", () => {
    // cenário: dia futuro no mesmo mês
    const a = baseArgs();

    a.nomeCategoria = "SOLICITAÇÕES";
    a.rowName = "kit_lanche";

    a.mesAnoConsiderado = new Date(); // mesmo mês
    a.mesAnoDefault = new Date();

    expect(call(a)).toBe(true);
  });

  it("deve desabilitar em programas quando resultado é falso mesmo com dados no state", () => {
    // cenário real do código: resultado falso bloqueia antes
    const a = baseArgs();

    a.ehProgramasEProjetosLocation = true;

    a.dadosValoresInclusoesAutorizadasState = {
      frequencia__dia_1__categoria_1: true,
    };

    a.inclusoesAutorizadas = [];

    expect(call(a)).toBe(true);
  });

  it("deve usar valor da faixa etária quando valor padrão não existe", () => {
    // cenário: fallback para faixa etária
    const a = baseArgs();

    delete a.values["frequencia__dia_1__categoria_1"];

    a.values["frequencia__faixa_1__dia_1__categoria_1"] = "Mês anterior";

    expect(call(a)).toBe(true);
  });

  it("deve desabilitar repeticao_refeicao em programas quando não há dados no state", () => {
    // cenário: repetição não influencia sem dados autorizados
    const a = baseArgs();

    a.ehProgramasEProjetosLocation = true;
    a.rowName = "repeticao_refeicao";

    a.dadosValoresInclusoesAutorizadasState = {};

    expect(call(a)).toBe(true);
  });
});
