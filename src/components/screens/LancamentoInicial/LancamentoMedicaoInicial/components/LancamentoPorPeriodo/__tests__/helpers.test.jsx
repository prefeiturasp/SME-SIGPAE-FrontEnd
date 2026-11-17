import {
  deveBloquearFinalizacaoDezembro,
  obterDataFinalizacaoMedicaoDezembro,
  obterUltimoDiaAtendimentoEscolaAberta,
} from "../helpers";

const cadastroCompleto = {
  data_inicial: "01/09/2026",
  data_final: "30/09/2026",
  dias_semana: ["4", "6"],
};

describe("obterUltimoDiaAtendimentoEscolaAberta", () => {
  it("retorna o último dia de atendimento dentro do mês", () => {
    const data = obterUltimoDiaAtendimentoEscolaAberta(
      cadastroCompleto,
      "09",
      "2026",
    );

    expect(data.getFullYear()).toBe(2026);
    expect(data.getMonth()).toBe(8);
    expect(data.getDate()).toBe(27);
  });

  it("considera o fim do período de realização do cadastro", () => {
    const data = obterUltimoDiaAtendimentoEscolaAberta(
      {
        ...cadastroCompleto,
        data_final: "19/09/2026",
      },
      "09",
      "2026",
    );

    expect(data.getFullYear()).toBe(2026);
    expect(data.getMonth()).toBe(8);
    expect(data.getDate()).toBe(18);
  });

  it("considera apenas os dias do mês de referência", () => {
    const data = obterUltimoDiaAtendimentoEscolaAberta(
      {
        ...cadastroCompleto,
        data_inicial: "01/08/2026",
        data_final: "31/10/2026",
      },
      "09",
      "2026",
    );

    expect(data.getFullYear()).toBe(2026);
    expect(data.getMonth()).toBe(8);
    expect(data.getDate()).toBe(27);
  });

  it("retorna null quando não há dia da semana correspondente no período", () => {
    const data = obterUltimoDiaAtendimentoEscolaAberta(
      {
        ...cadastroCompleto,
        data_inicial: "01/09/2026",
        data_final: "01/09/2026",
        dias_semana: ["5"],
      },
      "09",
      "2026",
    );

    expect(data).toBeNull();
  });

  it("retorna null quando não há cadastro", () => {
    expect(
      obterUltimoDiaAtendimentoEscolaAberta(null, "09", "2026"),
    ).toBeNull();
  });
});

describe("obterDataFinalizacaoMedicaoDezembro", () => {
  it("retorna a data quando é do mesmo mês e ano da medição", () => {
    const data = obterDataFinalizacaoMedicaoDezembro(
      "15/12/2025",
      "12",
      "2025",
    );

    expect(data.getFullYear()).toBe(2025);
    expect(data.getMonth()).toBe(11);
    expect(data.getDate()).toBe(15);
  });

  it("retorna null quando o mês é diferente do mês da medição", () => {
    expect(
      obterDataFinalizacaoMedicaoDezembro("15/11/2025", "12", "2025"),
    ).toBeNull();
  });

  it("retorna null quando o ano é diferente do ano da medição", () => {
    expect(
      obterDataFinalizacaoMedicaoDezembro("15/12/2026", "12", "2025"),
    ).toBeNull();
  });

  it("retorna null quando não há data cadastrada", () => {
    expect(obterDataFinalizacaoMedicaoDezembro(null, "12", "2025")).toBeNull();
  });

  it("retorna null para data inválida", () => {
    expect(
      obterDataFinalizacaoMedicaoDezembro("data-invalida", "12", "2025"),
    ).toBeNull();
  });
});

describe("deveBloquearFinalizacaoDezembro", () => {
  const dataCadastrada = new Date(2025, 11, 15);

  it("bloqueia antes da data cadastrada", () => {
    expect(
      deveBloquearFinalizacaoDezembro(
        dataCadastrada,
        null,
        new Date(2025, 11, 14, 23, 59),
      ),
    ).toBe(true);
  });

  it("libera na data cadastrada", () => {
    expect(
      deveBloquearFinalizacaoDezembro(
        dataCadastrada,
        null,
        new Date(2025, 11, 15, 0, 0),
      ),
    ).toBe(false);
  });

  it("bloqueia enquanto o último atendimento de Escola Aberta não terminou", () => {
    expect(
      deveBloquearFinalizacaoDezembro(
        dataCadastrada,
        new Date(2025, 11, 20),
        new Date(2025, 11, 20, 10, 0),
      ),
    ).toBe(true);
  });

  it("libera após o último atendimento de Escola Aberta", () => {
    expect(
      deveBloquearFinalizacaoDezembro(
        dataCadastrada,
        new Date(2025, 11, 20),
        new Date(2025, 11, 21, 10, 0),
      ),
    ).toBe(false);
  });
});
