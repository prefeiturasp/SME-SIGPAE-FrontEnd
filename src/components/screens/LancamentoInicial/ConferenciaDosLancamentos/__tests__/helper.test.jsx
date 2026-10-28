import {
  calcularDiasComApontamentoKitLanchePasseio,
  formatarNomePeriodo,
} from "../helper";

describe("calcularDiasComApontamentoKitLanchePasseio", () => {
  const valoresLancamentos = [
    { nome_campo: "frequencia", dia: "07", valor: "10" },
    { nome_campo: "frequencia", dia: "08", valor: "0" },
    { nome_campo: "matriculados", dia: "07", valor: "20" },
  ];
  const kitLanches = [
    { dia: "07", numero_alunos: 20 },
    { dia: "08", numero_alunos: 20 },
    { dia: "09", numero_alunos: 20 },
  ];

  it("identifica dia com frequência apontada e kit lanche autorizado", () => {
    const dias = calcularDiasComApontamentoKitLanchePasseio(
      valoresLancamentos,
      kitLanches,
      [],
    );

    expect([...dias]).toEqual(["07"]);
  });

  it("não identifica dia sem frequência apontada", () => {
    const dias = calcularDiasComApontamentoKitLanchePasseio(
      valoresLancamentos,
      kitLanches,
      [],
    );

    expect(dias.has("09")).toBe(false);
  });

  it("não identifica dia com frequência zerada", () => {
    const dias = calcularDiasComApontamentoKitLanchePasseio(
      valoresLancamentos,
      kitLanches,
      [],
    );

    expect(dias.has("08")).toBe(false);
  });

  it("não identifica dia com inclusão de alimentação autorizada", () => {
    const dias = calcularDiasComApontamentoKitLanchePasseio(
      valoresLancamentos,
      kitLanches,
      [{ dia: "07" }],
    );

    expect(dias.size).toBe(0);
  });
});

describe("formatarNomePeriodo", () => {
  it.each([
    ["MANHA", "Manhã"],
    ["TARDE", "Tarde"],
    ["NOITE", "Noite"],
    ["INTEGRAL", "Integral"],
    ["PARCIAL", "Parcial"],
    ["VESPERTINO", "Vespertino"],
    ["INTERMEDIARIO", "Intermediário"],
    ["Programas e Projetos - MANHA", "Programas e Projetos - Manhã"],
    ["Programas e Projetos - TARDE", "Programas e Projetos - Tarde"],
    ["Programas e Projetos - NOITE", "Programas e Projetos - Noite"],
    ["Programas e Projetos - INTEGRAL", "Programas e Projetos - Integral"],
    ["Programas e Projetos - PARCIAL", "Programas e Projetos - Parcial"],
    ["Programas e Projetos - VESPERTINO", "Programas e Projetos - Vespertino"],
    [
      "Programas e Projetos - INTERMEDIARIO",
      "Programas e Projetos - Intermediário",
    ],
  ])('deve formatar "%s" como "%s"', (entrada, esperado) => {
    expect(formatarNomePeriodo(entrada)).toBe(esperado);
  });

  it("deve retornar o valor original se não houver correspondência", () => {
    expect(formatarNomePeriodo("DESCONHECIDO")).toBe("DESCONHECIDO");
  });

  it("deve retornar undefined se entrada for undefined", () => {
    expect(formatarNomePeriodo(undefined)).toBeUndefined();
  });

  it("deve retornar null se entrada for null", () => {
    expect(formatarNomePeriodo(null)).toBeNull();
  });
});
