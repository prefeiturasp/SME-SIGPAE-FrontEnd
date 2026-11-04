import {
  MENSAGEM_LANCAMENTO_MAIOR_QUE_PARTICIPANTES,
  MENSAGEM_VALOR_INVALIDO,
  dataHabilitada,
  dataNoPeriodo,
  formatarMesAno,
  montarDiasDaSemana,
  montarLinhasTiposAlimentacao,
  montarPayload,
  montarSemanas,
  montarValoresIniciais,
  validarValor,
} from "../helper";

const cadastro = {
  data_inicial: "01/10/2026",
  data_final: "31/10/2026",
  dias_semana: ["0", "2"],
  num_participantes: 50,
  tipos_alimentacao: [
    { uuid: "uuid-lanche-4h", nome: "Lanche 4h" },
    { uuid: "uuid-lanche", nome: "Lanche" },
    { uuid: "uuid-refeicao", nome: "Refeição" },
    { uuid: "uuid-sobremesa", nome: "Sobremesa" },
  ],
};

describe("PeriodoLancamentoEscolaAberta helper", () => {
  it("formata o mês e ano de referência", () => {
    expect(formatarMesAno(new Date(2026, 8, 1))).toBe("Setembro / 2026");
  });

  it("monta as semanas do mês conforme padrão da medição inicial", () => {
    expect(montarSemanas(new Date(2026, 8, 1))).toEqual([
      { key: "1", label: "Semana 1" },
      { key: "2", label: "Semana 2" },
      { key: "3", label: "Semana 3" },
      { key: "4", label: "Semana 4" },
      { key: "5", label: "Semana 5" },
    ]);
  });

  it("monta a primeira semana incluindo dias do mês anterior", () => {
    const dias = montarDiasDaSemana(new Date(2026, 8, 1), 1);

    expect(dias).toHaveLength(7);
    expect(dias[0]).toEqual({ dia: "31", mes: "08", ano: "2026" });
    expect(dias[1]).toEqual({ dia: "01", mes: "09", ano: "2026" });
    expect(dias[6]).toEqual({ dia: "06", mes: "09", ano: "2026" });
  });

  it("monta os tipos de alimentação com as repetições de refeição e sobremesa", () => {
    expect(montarLinhasTiposAlimentacao(cadastro.tipos_alimentacao)).toEqual([
      { nome: "Lanche 4h", name: "lanche_4h", uuid: "uuid-lanche-4h" },
      { nome: "Lanche", name: "lanche", uuid: "uuid-lanche" },
      { nome: "Refeição 1ª Oferta", name: "refeicao", uuid: "uuid-refeicao" },
      { nome: "Repetição Refeição", name: "repeticao_refeicao", uuid: null },
      {
        nome: "Sobremesa 1º Oferta",
        name: "sobremesa",
        uuid: "uuid-sobremesa",
      },
      {
        nome: "Repetição Sobremesa",
        name: "repeticao_sobremesa",
        uuid: null,
      },
    ]);
  });

  it("habilita somente datas do mês que pertencem ao período e ao dia da semana", () => {
    const segunda = { dia: "05", mes: "10", ano: "2026" };
    const terca = { dia: "06", mes: "10", ano: "2026" };
    const foraDoMes = { dia: "01", mes: "09", ano: "2026" };
    const dataReferencia = new Date(2026, 9, 10);

    expect(
      dataHabilitada(segunda, new Date(2026, 9, 1), cadastro, dataReferencia),
    ).toBe(true);
    expect(
      dataHabilitada(terca, new Date(2026, 9, 1), cadastro, dataReferencia),
    ).toBe(false);
    expect(
      dataHabilitada(foraDoMes, new Date(2026, 9, 1), cadastro, dataReferencia),
    ).toBe(false);
  });

  it("bloqueia datas de hoje e futuras, liberando apenas ontem e anteriores", () => {
    const cadastroTodosOsDias = {
      ...cadastro,
      data_inicial: "01/11/2026",
      data_final: "30/11/2026",
      dias_semana: ["0", "1", "2", "3", "4", "5", "6"],
    };
    const dataReferencia = new Date(2026, 10, 5);

    expect(
      dataHabilitada(
        { dia: "03", mes: "11", ano: "2026" },
        new Date(2026, 10, 1),
        cadastroTodosOsDias,
        dataReferencia,
      ),
    ).toBe(true);
    expect(
      dataHabilitada(
        { dia: "04", mes: "11", ano: "2026" },
        new Date(2026, 10, 1),
        cadastroTodosOsDias,
        dataReferencia,
      ),
    ).toBe(true);
    expect(
      dataHabilitada(
        { dia: "05", mes: "11", ano: "2026" },
        new Date(2026, 10, 1),
        cadastroTodosOsDias,
        dataReferencia,
      ),
    ).toBe(false);
    expect(
      dataHabilitada(
        { dia: "06", mes: "11", ano: "2026" },
        new Date(2026, 10, 1),
        cadastroTodosOsDias,
        dataReferencia,
      ),
    ).toBe(false);

    expect(
      dataNoPeriodo(
        { dia: "05", mes: "11", ano: "2026" },
        new Date(2026, 10, 1),
        cadastroTodosOsDias,
      ),
    ).toBe(true);
    expect(
      dataNoPeriodo(
        { dia: "06", mes: "11", ano: "2026" },
        new Date(2026, 10, 1),
        cadastroTodosOsDias,
      ),
    ).toBe(true);
  });

  it("mantém o número de participantes visível em datas bloqueadas para lançamento", () => {
    const cadastroTodosOsDias = {
      ...cadastro,
      data_inicial: "01/11/2026",
      data_final: "30/11/2026",
      dias_semana: ["0", "1", "2", "3", "4", "5", "6"],
    };

    const valores = montarValoresIniciais({
      cadastro: cadastroTodosOsDias,
      linhas: [],
      categoriaId: 1,
      mesAno: new Date(2026, 10, 1),
      valoresSalvos: [],
    });

    expect(valores["participantes__dia_05__categoria_1"]).toBe("50");
    expect(valores["participantes__dia_06__categoria_1"]).toBe("50");
  });

  it("valida limite de participantes apenas na primeira oferta", () => {
    expect(validarValor("lanche", 51, 50)).toBe(
      MENSAGEM_LANCAMENTO_MAIOR_QUE_PARTICIPANTES,
    );
    expect(validarValor("refeicao", 50, 50)).toBeUndefined();
    expect(validarValor("repeticao_refeicao", 100, 50)).toBeUndefined();
    expect(validarValor("lanche", -1, 50)).toBe(MENSAGEM_VALOR_INVALIDO);
  });

  it("monta o payload somente com as datas habilitadas e os tipos vinculados", () => {
    const linhas = montarLinhasTiposAlimentacao(cadastro.tipos_alimentacao);
    const payload = montarPayload({
      solicitacaoUuid: "uuid-solicitacao",
      categoriaId: 1,
      values: {
        lanche__dia_05__categoria_1: "10",
        refeicao__dia_06__categoria_1: "20",
        repeticao_refeicao__dia_05__categoria_1: "2",
        observacoes__dia_05__categoria_1: "<p>Observação</p>",
      },
      colunasHabilitadas: [{ dia: "05" }],
      linhas,
      numParticipantes: 50,
    });

    expect(payload).toEqual({
      solicitacao_medicao_inicial: "uuid-solicitacao",
      grupo: "Escola Aberta",
      valores_medicao: [
        {
          dia: "05",
          valor: "50",
          nome_campo: "participantes",
          categoria_medicao: 1,
          tipo_alimentacao: "",
        },
        {
          dia: "05",
          valor: "10",
          nome_campo: "lanche",
          categoria_medicao: 1,
          tipo_alimentacao: "uuid-lanche",
        },
        {
          dia: "05",
          valor: "2",
          nome_campo: "repeticao_refeicao",
          categoria_medicao: 1,
          tipo_alimentacao: "",
        },
        {
          dia: "05",
          valor: "<p>Observação</p>",
          nome_campo: "observacoes",
          categoria_medicao: 1,
          tipo_alimentacao: "",
        },
      ],
    });
  });
});
