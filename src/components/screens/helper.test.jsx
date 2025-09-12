import { formataValorDecimal } from "./helper";

describe("formataValorDecimal", () => {
  test("deve retornar string vazia para valores falsy", () => {
    expect(formataValorDecimal(null)).toBe("");
    expect(formataValorDecimal(undefined)).toBe("");
    expect(formataValorDecimal(0)).toBe("0");
    expect(formataValorDecimal("")).toBe("");
  });

  test("deve formatar números inteiros corretamente", () => {
    expect(formataValorDecimal(1000)).toBe("1.000");
    expect(formataValorDecimal(100)).toBe("100");
    expect(formataValorDecimal(10)).toBe("10");
    expect(formataValorDecimal(1)).toBe("1");
    expect(formataValorDecimal(1234567)).toBe("1.234.567");
  });

  test("deve formatar números decimais corretamente", () => {
    expect(formataValorDecimal(1234.56)).toBe("1.234,56");
    expect(formataValorDecimal(1234.5)).toBe("1.234,5");
    expect(formataValorDecimal(1234.0)).toBe("1.234");
    expect(formataValorDecimal(0.5)).toBe("0,5");
    expect(formataValorDecimal(0.05)).toBe("0,05");
  });

  test("deve funcionar com valores string", () => {
    expect(formataValorDecimal("1000")).toBe("1.000");
    expect(formataValorDecimal("1234.56")).toBe("1.234,56");
    expect(formataValorDecimal("1234.5")).toBe("1.234,5");
  });

  test("deve lidar com valores grandes", () => {
    expect(formataValorDecimal(1234567890.12)).toBe("1.234.567.890,12");
    expect(formataValorDecimal(999999999.99)).toBe("999.999.999,99");
  });

  test("deve manter o formato para números com menos de 4 dígitos", () => {
    expect(formataValorDecimal(999)).toBe("999");
    expect(formataValorDecimal(99)).toBe("99");
    expect(formataValorDecimal(9)).toBe("9");
    expect(formataValorDecimal(999.99)).toBe("999,99");
  });

  test("deve funcionar com valores negativos", () => {
    expect(formataValorDecimal(-1000)).toBe("-1.000");
    expect(formataValorDecimal(-1234.56)).toBe("-1.234,56");
    expect(formataValorDecimal(-0.5)).toBe("-0,5");
  });
});
