import { obterUltimoDiaAtendimentoEscolaAberta } from "../helpers";

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
