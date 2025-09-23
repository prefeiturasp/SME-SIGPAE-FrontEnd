import { agruparMilharDecimal } from "../helpers";

describe("agruparMilharDecimal", () => {
  test("deve retornar string vazia para valores null/undefined", () => {
    expect(agruparMilharDecimal(null)).toBe("");
    expect(agruparMilharDecimal(undefined)).toBe("");
  });

  test("deve manter números com 1 ou 2 dígitos sem formatação", () => {
    expect(agruparMilharDecimal("1")).toBe("1");
    expect(agruparMilharDecimal("12")).toBe("12");
    expect(agruparMilharDecimal(1)).toBe("1");
    expect(agruparMilharDecimal(12)).toBe("12");
  });

  test("deve formatar números com 3 dígitos corretamente", () => {
    expect(agruparMilharDecimal("123")).toBe("1,23");
    expect(agruparMilharDecimal(123)).toBe("1,23");
  });

  test("deve formatar números com 4 dígitos corretamente", () => {
    expect(agruparMilharDecimal("1234")).toBe("12,34");
    expect(agruparMilharDecimal(1234)).toBe("12,34");
  });

  test("deve formatar números com 5 dígitos corretamente", () => {
    expect(agruparMilharDecimal("12345")).toBe("123,45");
    expect(agruparMilharDecimal(12345)).toBe("123,45");
  });

  test("deve formatar números com 6 dígitos corretamente", () => {
    expect(agruparMilharDecimal("123456")).toBe("1.234,56");
    expect(agruparMilharDecimal(123456)).toBe("1.234,56");
  });

  test("deve formatar números grandes corretamente", () => {
    expect(agruparMilharDecimal("123456789")).toBe("1.234.567,89");
    expect(agruparMilharDecimal(123456789)).toBe("1.234.567,89");
  });

  test("deve remover caracteres não numéricos", () => {
    expect(agruparMilharDecimal("1a2b3c")).toBe("1,23");
    expect(agruparMilharDecimal("R$ 1.234,56")).toBe("1.234,56");
    expect(agruparMilharDecimal("12-34-56")).toBe("1.234,56");
  });

  test("deve lidar com zero corretamente", () => {
    expect(agruparMilharDecimal("0")).toBe("0");
    expect(agruparMilharDecimal(0)).toBe("0");
  });

  test("deve lidar com strings vazias", () => {
    expect(agruparMilharDecimal("")).toBe("");
  });
});
