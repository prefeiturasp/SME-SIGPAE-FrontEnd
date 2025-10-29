import { formatarNomePeriodo } from "../helper";

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
