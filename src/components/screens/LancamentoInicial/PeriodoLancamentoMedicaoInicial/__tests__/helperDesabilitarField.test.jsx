import { desabilitarField } from "src/components/screens/LancamentoInicial/PeriodoLancamentoMedicaoInicial/helper.jsx";

describe("desabilitarField", () => {
  const mockValues = {
    frequencia__dia_1__categoria_1: "10",
    matriculados__dia_1__categoria_1: "20",
    numero_de_alunos__dia_1__categoria_1: "20",
    dietas_autorizadas__dia_1__categoria_1: "5",
    observacoes__dia_1__categoria_1: "obs",
  };
  const mockLocation = {
    state: {
      status_periodo: "MEDICAO_ENVIADA_PELA_UE",
      ehPeriodoEspecifico: false,
    },
  };
  const mockMesAnoConsiderado = new Date("2023-10-01");
  const mockMesAnoDefault = new Date("2023-10-01");
  const mockDadosValoresInclusoesAutorizadasState = {};
  const mockValidacaoDiaLetivo = jest.fn(() => true);
  const mockValidacaoDiaLetivoCalendario = jest.fn(() => true);
  const mockValidacaoDiaLetivoLancheEmergencial = jest.fn(() => true);
  const mockValidacaoSemana = jest.fn(() => false);
  const mockEhUltimoDiaLetivoDoAno = jest.fn(() => false);

  const baseArgs = () => ({
    dia: 1,
    rowName: "frequencia",
    categoria: 1,
    nomeCategoria: "ALIMENTAÇÃO",
    values: { ...mockValues },
    mesAnoConsiderado: mockMesAnoConsiderado,
    mesAnoDefault: mockMesAnoDefault,
    dadosValoresInclusoesAutorizadasState:
      mockDadosValoresInclusoesAutorizadasState,
    validacaoDiaLetivo: mockValidacaoDiaLetivo,
    validacaoDiaLetivoCalendario: mockValidacaoDiaLetivoCalendario,
    validacaoDiaLetivoLancheEmergencial:
      mockValidacaoDiaLetivoLancheEmergencial,
    validacaoSemana: mockValidacaoSemana,
    location: { ...mockLocation },
    ehGrupoETECUrlParam: false,
    dadosValoresInclusoesEtecAutorizadasState: {},
    inclusoesEtecAutorizadas: [],
    grupoLocation: null,
    valoresPeriodosLancamentos: [],
    feriadosNoMes: [],
    inclusoesAutorizadas: [],
    categoriasDeMedicao: [{ id: 1, nome: "ALIMENTAÇÃO" }],
    kitLanchesAutorizadas: [],
    alteracoesAlimentacaoAutorizadas: [],
    diasLancheEmergencialDiarioAtivo: [],
    diasParaCorrecao: [],
    ehPeriodoEscolarSimples: false,
    permissoesLancamentosEspeciaisPorDia: [],
    alimentacoesLancamentosEspeciais: [],
    escolaEhEMEBS: false,
    alunosTabSelecionada: null,
    ehUltimoDiaLetivoDoAno: mockEhUltimoDiaLetivoDoAno,
  });

  const callDesabilitarField = (args) =>
    desabilitarField(
      args.dia,
      args.rowName,
      args.categoria,
      args.nomeCategoria,
      args.values,
      args.mesAnoConsiderado,
      args.mesAnoDefault,
      args.dadosValoresInclusoesAutorizadasState,
      args.validacaoDiaLetivo,
      args.validacaoDiaLetivoCalendario,
      args.validacaoDiaLetivoLancheEmergencial,
      args.validacaoSemana,
      args.location,
      args.ehGrupoETECUrlParam,
      args.dadosValoresInclusoesEtecAutorizadasState,
      args.inclusoesEtecAutorizadas,
      args.grupoLocation,
      args.valoresPeriodosLancamentos,
      args.feriadosNoMes,
      args.inclusoesAutorizadas,
      args.categoriasDeMedicao,
      args.kitLanchesAutorizadas,
      args.alteracoesAlimentacaoAutorizadas,
      args.diasLancheEmergencialDiarioAtivo,
      args.diasParaCorrecao,
      args.ehPeriodoEscolarSimples,
      args.permissoesLancamentosEspeciaisPorDia,
      args.alimentacoesLancamentosEspeciais,
      args.escolaEhEMEBS,
      args.alunosTabSelecionada,
      args.ehUltimoDiaLetivoDoAno,
    );

  // ------------------------------------------------------------------------
  // Testes padronizados
  // ------------------------------------------------------------------------

  it('deve retornar true quando valorAtual for "Mês anterior"', () => {
    const args = baseArgs();
    args.values = {
      ...args.values,
      frequencia__dia_1__categoria_1: "Mês anterior",
    };
    expect(callDesabilitarField(args)).toBe(true);
  });

  it('deve retornar true quando valorAtual for "Mês posterior"', () => {
    const args = baseArgs();
    args.values = {
      ...args.values,
      frequencia__dia_1__categoria_1: "Mês posterior",
    };
    expect(callDesabilitarField(args)).toBe(true);
  });

  it("deve retornar true para DIETA ESPECIAL quando inclusão autorizada é apenas sobremesa", () => {
    const args = baseArgs();
    args.nomeCategoria = "DIETA ESPECIAL";
    args.inclusoesAutorizadas = [{ alimentacoes: "sobremesa" }];
    expect(callDesabilitarField(args)).toBe(true);
  });

  it("deve retornar true para status MEDICAO_APROVADA_PELA_DRE", () => {
    const args = baseArgs();
    args.location.state.status_periodo = "MEDICAO_APROVADA_PELA_DRE";
    expect(callDesabilitarField(args)).toBe(true);
  });

  it("deve retornar false quando habilitado_correcao for true", () => {
    const args = baseArgs();
    args.location.state.status_periodo = "MEDICAO_CORRECAO_SOLICITADA";
    args.valoresPeriodosLancamentos = [
      { categoria_medicao: 1, dia: 1, habilitado_correcao: true },
    ];
    expect(callDesabilitarField(args)).toBe(false);
  });

  it("deve retornar true para SOLICITAÇÕES quando não há kit_lanche autorizado", () => {
    const args = baseArgs();
    args.nomeCategoria = "SOLICITAÇÕES";
    args.rowName = "kit_lanche";
    args.kitLanchesAutorizadas = [];
    expect(callDesabilitarField(args)).toBe(true);
  });

  it("deve retornar false para ETEC com condições válidas", () => {
    const args = baseArgs();
    args.location.state.status_periodo =
      "MEDICAO_EM_ABERTO_PARA_PREENCHIMENTO_UE";
    args.ehGrupoETECUrlParam = true;
    args.dadosValoresInclusoesEtecAutorizadasState = {
      frequencia__dia_1__categoria_1: true,
    };
    expect(callDesabilitarField(args)).toBe(false);
  });

  it("deve retornar true para Programas e Projetos quando numero_de_alunos está vazio", () => {
    const args = baseArgs();
    args.grupoLocation = "Programas e Projetos";
    args.values = {
      ...args.values,
      numero_de_alunos__dia_1__categoria_1: "",
    };
    expect(callDesabilitarField(args)).toBe(true);
  });

  it("deve retornar true para Recreio nas Férias quando participantes está vazio", () => {
    const args = baseArgs();
    args.grupoLocation = "Recreio nas Férias";
    args.values = {
      ...args.values,
      participantes__dia_1__categoria_1: "",
    };
    expect(callDesabilitarField(args)).toBe(true);
  });

  it("deve retornar false para período simples com lançamentos especiais autorizados", () => {
    const args = baseArgs();
    args.location.state.status_periodo =
      "MEDICAO_EM_ABERTO_PARA_PREENCHIMENTO_UE";
    args.location.state.ehPeriodoEspecifico = false;
    args.rowName = "lanche";
    args.permissoesLancamentosEspeciaisPorDia = [
      { dia: 1, alimentacoes: ["lanche"] },
    ];
    args.alimentacoesLancamentosEspeciais = ["lanche"];
    args.ehPeriodoEscolarSimples = true;
    expect(callDesabilitarField(args)).toBe(false);
  });

  it("deve retornar true quando não há matriculados e não é período específico", () => {
    const args = baseArgs();
    args.values = {
      ...args.values,
      matriculados__dia_1__categoria_1: "",
    };
    expect(callDesabilitarField(args)).toBe(true);
  });

  it("deve retornar false quando campo está presente em dadosValoresInclusoesAutorizadasState", () => {
    const args = baseArgs();
    args.location.state.status_periodo =
      "MEDICAO_EM_ABERTO_PARA_PREENCHIMENTO_UE";
    args.dadosValoresInclusoesAutorizadasState = {
      frequencia__dia_1__categoria_1: true,
    };
    expect(callDesabilitarField(args)).toBe(false);
  });

  it("deve retornar false para EMEBS com correção habilitada", () => {
    const args = baseArgs();

    args.location.state.status_periodo = "MEDICAO_CORRECAO_SOLICITADA";
    args.escolaEhEMEBS = true;
    args.valoresPeriodosLancamentos = [
      {
        categoria_medicao: 1,
        dia: 1,
        habilitado_correcao: true,
        infantil_ou_fundamental: "INFANTIL",
      },
    ];
    args.diasParaCorrecao = [
      {
        dia: 1,
        categoria_medicao: 1,
        habilitado_correcao: true,
        infantil_ou_fundamental: "INFANTIL",
      },
    ];
    args.alunosTabSelecionada = 1;

    expect(callDesabilitarField(args)).toBe(false);
  });

  it("deve retornar true para SOLICITAÇÕES quando não há lanche_emergencial autorizado", () => {
    const args = baseArgs();
    args.nomeCategoria = "SOLICITAÇÕES";
    args.rowName = "lanche_emergencial";
    args.alteracoesAlimentacaoAutorizadas = [];
    args.diasLancheEmergencialDiarioAtivo = [];
    expect(callDesabilitarField(args)).toBe(true);
  });

  it("deve retornar false para ETEC repeticao_refeicao com inclusão autorizada", () => {
    const args = baseArgs();
    args.location.state.status_periodo =
      "MEDICAO_EM_ABERTO_PARA_PREENCHIMENTO_UE";
    args.ehGrupoETECUrlParam = true;
    args.rowName = "repeticao_refeicao";
    args.inclusoesEtecAutorizadas = [{ dia: 1, alimentacoes: "refeicao" }];
    expect(callDesabilitarField(args)).toBe(false);
  });

  it("deve retornar false para Programas e Projetos com inclusão autorizada no state", () => {
    const args = baseArgs();
    args.grupoLocation = "Programas e Projetos";
    args.location.state.status_periodo =
      "MEDICAO_EM_ABERTO_PARA_PREENCHIMENTO_UE";
    args.dadosValoresInclusoesAutorizadasState = {
      frequencia__dia_1__categoria_1: true,
    };
    args.values = {
      ...args.values,
      numero_de_alunos__dia_1__categoria_1: 10,
      dietas_autorizadas__dia_1__categoria_1: 5,
    };
    expect(callDesabilitarField(args)).toBe(false);
  });

  it("deve retornar true para Recreio nas Férias ALIMENTAÇÃO quando participantes está vazio", () => {
    const args = baseArgs();
    args.grupoLocation = "Recreio nas Férias";
    args.nomeCategoria = "ALIMENTAÇÃO";
    args.values = {
      ...args.values,
      participantes__dia_1__categoria_1: "",
    };
    expect(callDesabilitarField(args)).toBe(true);
  });

  it("deve retornar true para DIETA ESPECIAL quando dietas_autorizadas está vazio", () => {
    const args = baseArgs();
    args.nomeCategoria = "DIETA ESPECIAL";
    args.values = {
      ...args.values,
      dietas_autorizadas__dia_1__categoria_1: "",
    };
    expect(callDesabilitarField(args)).toBe(true);
  });

  it("deve retornar false quando repeticao_refeicao está autorizado no state", () => {
    const args = baseArgs();
    args.location.state.status_periodo =
      "MEDICAO_EM_ABERTO_PARA_PREENCHIMENTO_UE";
    args.rowName = "repeticao_refeicao";
    args.dadosValoresInclusoesAutorizadasState = {
      refeicao__dia_1__categoria_1: true,
    };
    expect(callDesabilitarField(args)).toBe(false);
  });

  it("deve retornar false quando repeticao_sobremesa está autorizado no state", () => {
    const args = baseArgs();
    args.location.state.status_periodo =
      "MEDICAO_EM_ABERTO_PARA_PREENCHIMENTO_UE";
    args.rowName = "repeticao_sobremesa";
    args.dadosValoresInclusoesAutorizadasState = {
      sobremesa__dia_1__categoria_1: true,
    };
    expect(callDesabilitarField(args)).toBe(false);
  });

  it("deve retornar false quando frequencia está autorizado no state", () => {
    const args = baseArgs();
    args.location.state.status_periodo =
      "MEDICAO_EM_ABERTO_PARA_PREENCHIMENTO_UE";
    args.dadosValoresInclusoesAutorizadasState = {
      frequencia__dia_1__categoria_1: true,
    };
    expect(callDesabilitarField(args)).toBe(false);
  });

  it('deve retornar true quando matriculados é igual a "0"', () => {
    const args = baseArgs();
    args.values = {
      ...args.values,
      matriculados__dia_1__categoria_1: "0",
    };
    expect(callDesabilitarField(args)).toBe(true);
  });

  it('deve retornar true quando dietas_autorizadas é igual a "0"', () => {
    const args = baseArgs();
    args.nomeCategoria = "DIETA ESPECIAL";
    args.values = {
      ...args.values,
      dietas_autorizadas__dia_1__categoria_1: "0",
    };
    expect(callDesabilitarField(args)).toBe(true);
  });

  it("deve retornar true quando mês considerado é maior que o mês atual e dia >= dia padrão", () => {
    const args = baseArgs();
    args.dia = 15;
    args.mesAnoConsiderado = new Date("2023-11-01");
    args.mesAnoDefault = new Date("2023-10-15");
    expect(callDesabilitarField(args)).toBe(true);
  });

  it("deve retornar true para ETEC quando fallback de validação de dia letivo falha", () => {
    const args = baseArgs();
    args.ehGrupoETECUrlParam = true;
    args.validacaoDiaLetivo = jest.fn(() => false);
    expect(callDesabilitarField(args)).toBe(true);
  });

  it("deve retornar false para SOLICITAÇÕES quando kit_lanche está autorizado", () => {
    const args = baseArgs();
    args.nomeCategoria = "SOLICITAÇÕES";
    args.rowName = "kit_lanche";
    args.kitLanchesAutorizadas = [{ dia: 1 }];
    expect(callDesabilitarField(args)).toBe(false);
  });

  it("deve retornar false para Recreio nas Férias - DIETA ESPECIAL quando valores são válidos", () => {
    const args = baseArgs();
    args.grupoLocation = "Recreio nas Férias";
    args.nomeCategoria = "DIETA ESPECIAL";
    args.values = {
      ...args.values,
      participantes__dia_1__categoria_1: 10,
      dietas_autorizadas__dia_1__categoria_1: 2,
    };
    expect(callDesabilitarField(args)).toBe(false);
  });

  it("deve retornar true para EMEBS em correção quando não há permissão de correção", () => {
    const args = baseArgs();
    args.escolaEhEMEBS = true;
    args.location.state.status_periodo = "MEDICAO_CORRECAO_SOLICITADA";
    args.valoresPeriodosLancamentos = [];
    args.diasParaCorrecao = [];
    expect(callDesabilitarField(args)).toBe(true);
  });

  it("deve retornar true para DIETA ESPECIAL quando inclusões autorizadas não contemplam o dia", () => {
    const args = baseArgs();
    args.nomeCategoria = "DIETA ESPECIAL";
    args.inclusoesAutorizadas = [{ dia: 2 }];
    args.location.state.ehPeriodoEspecifico = true;
    expect(callDesabilitarField(args)).toBe(true);
  });

  it("deve retornar false quando campo possui chave em dadosValoresInclusoesAutorizadasState", () => {
    const args = baseArgs();
    args.location.state.status_periodo =
      "MEDICAO_EM_ABERTO_PARA_PREENCHIMENTO_UE";
    args.dadosValoresInclusoesAutorizadasState = {
      frequencia__dia_1__categoria_1: true,
    };
    expect(callDesabilitarField(args)).toBe(false);
  });

  it("deve retornar true no fallback final quando a semana é inválida", () => {
    const args = baseArgs();
    args.validacaoSemana = jest.fn(() => true);
    expect(callDesabilitarField(args)).toBe(true);
  });

  it("deve retornar false para repeticao_2_sobremesa quando autorizado", () => {
    const args = baseArgs();
    args.location.state.status_periodo =
      "MEDICAO_EM_ABERTO_PARA_PREENCHIMENTO_UE";
    args.rowName = "repeticao_2_sobremesa";
    args.dadosValoresInclusoesAutorizadasState = {
      repeticao_2_sobremesa__dia_1__categoria_1: true,
    };
    expect(callDesabilitarField(args)).toBe(false);
  });

  it("deve retornar true para ETEC quando dadosValoresInclusoesEtecAutorizadasState está vazio", () => {
    const args = baseArgs();
    args.ehGrupoETECUrlParam = true;
    args.dadosValoresInclusoesEtecAutorizadasState = {};
    expect(callDesabilitarField(args)).toBe(true);
  });

  it("deve desabilitar quando alimentação especial não está permitida no dia", () => {
    // cenário: alimentação especial existe, mas não está liberada no dia
    const args = baseArgs();

    args.location.state.status_periodo = "MEDICAO_CORRECAO_SOLICITADA";
    args.valoresPeriodosLancamentos = [
      { categoria_medicao: 1, dia: 1, habilitado_correcao: true },
    ];

    args.alimentacoesLancamentosEspeciais = ["lanche"];
    args.permissoesLancamentosEspeciaisPorDia = [
      { dia: 1, alimentacoes: [] }, // não inclui lanche
    ];

    args.rowName = "lanche";
    args.ehPeriodoEscolarSimples = true;

    expect(callDesabilitarField(args)).toBe(true);
  });

  it("deve desabilitar EMEBS em Programas e Projetos sem correção direta", () => {
    // cenário: EMEBS + Programas e Projetos sem valorFieldParaCorrecao
    const args = baseArgs();

    args.escolaEhEMEBS = true;
    args.grupoLocation = "Programas e Projetos";
    args.location.state.status_periodo = "MEDICAO_CORRECAO_SOLICITADA";

    args.valoresPeriodosLancamentos = []; // força !valorFieldParaCorrecao
    args.diasParaCorrecao = [
      {
        dia: 1,
        categoria_medicao: 1,
        habilitado_correcao: true,
        infantil_ou_fundamental: "INFANTIL",
      },
    ];

    args.alunosTabSelecionada = 1;

    expect(callDesabilitarField(args)).toBe(true);
  });
  it("deve desabilitar ETEC no fallback completo", () => {
    // cenário: nenhuma condição válida → cai no return final do ETEC
    const args = baseArgs();

    args.ehGrupoETECUrlParam = true;
    args.validacaoDiaLetivo = jest.fn(() => false);

    expect(callDesabilitarField(args)).toBe(true);
  });

  it("deve desabilitar quando não há alunos regulares para dieta", () => {
    // cenário: dieta especial sem alunos suficientes → função interna retorna true
    const args = baseArgs();

    args.grupoLocation = "Programas e Projetos";
    args.nomeCategoria = "DIETA ESPECIAL";

    args.values["dietas_autorizadas__dia_1__categoria_1"] = 0;

    expect(callDesabilitarField(args)).toBe(true);
  });

  it("deve permitir quando alimentação especial está liberada no dia", () => {
    // cenário: alimentação especial válida e sem bloqueio por status
    const args = baseArgs();

    args.ehPeriodoEscolarSimples = true;
    args.nomeCategoria = "ALIMENTAÇÃO";
    args.rowName = "lanche";

    args.location.state.status_periodo =
      "MEDICAO_EM_ABERTO_PARA_PREENCHIMENTO_UE";

    args.alimentacoesLancamentosEspeciais = ["lanche"];
    args.permissoesLancamentosEspeciaisPorDia = [
      { dia: 1, alimentacoes: ["lanche"] },
    ];

    args.validacaoDiaLetivo = jest.fn(() => true);
    args.validacaoSemana = jest.fn(() => false);

    args.values["matriculados__dia_1__categoria_1"] = "10";
    args.values["lanche__dia_1__categoria_1"] = "5";

    expect(callDesabilitarField(args)).toBe(false);
  });

  it("deve desabilitar quando rowName é numero_de_alunos mesmo em correção", () => {
    // cenário: campo bloqueado explicitamente mesmo com correção ativa
    const args = baseArgs();

    args.location.state.status_periodo = "MEDICAO_CORRECAO_SOLICITADA";
    args.rowName = "numero_de_alunos";

    args.valoresPeriodosLancamentos = [
      { categoria_medicao: 1, dia: 1, habilitado_correcao: true },
    ];

    expect(callDesabilitarField(args)).toBe(true);
  });

  it("deve desabilitar quando location.state não existe", () => {
    const args = baseArgs();

    args.location = {};

    expect(callDesabilitarField(args)).toBe(false);
  });
});
