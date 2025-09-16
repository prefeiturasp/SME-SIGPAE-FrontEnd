import { formataValor } from "../helpers"; // Ajuste o caminho conforme necessário

describe("formataValor", () => {
  test("formata números inteiros corretamente", () => {
    expect(formataValor(1000)).toBe("1.000%");
    expect(formataValor(100)).toBe("100%");
    expect(formataValor(1234567)).toBe("1.234.567%");
  });

  test("formata números decimais corretamente", () => {
    expect(formataValor(1234.56)).toBe("1.234,56%");
    expect(formataValor(1234.5)).toBe("1.234,5%");
    expect(formataValor(1234.0)).toBe("1.234%");
  });

  test("remove zeros decimais corretamente", () => {
    expect(formataValor(50.0)).toBe("50%");
    expect(formataValor(100.0)).toBe("100%");
    expect(formataValor(1234.0)).toBe("1.234%");
  });

  test("lida com números negativos", () => {
    expect(formataValor(-1000)).toBe("-1.000%");
    expect(formataValor(-1234.56)).toBe("-1.234,56%");
    expect(formataValor(-50.0)).toBe("-50%");
  });

  test("lida com zero", () => {
    expect(formataValor(0)).toBe("0%");
    expect(formataValor(0.0)).toBe("0%");
  });

  test("lida com números pequenos", () => {
    expect(formataValor(1)).toBe("1%");
    expect(formataValor(12)).toBe("12%");
    expect(formataValor(123)).toBe("123%");
  });

  test("lida com números muito grandes", () => {
    expect(formataValor(1234567890123)).toBe("1.234.567.890.123%");
  });
});
