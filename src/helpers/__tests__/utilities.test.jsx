import { formataMilhar, formataMilharDecimal, geradorUUID } from "../utilities";

describe("formataMilhar", () => {
  test("deve formatar números corretamente", () => {
    expect(formataMilhar(1000)).toBe("1.000");
    expect(formataMilhar(100)).toBe("100");
    expect(formataMilhar(1234567)).toBe("1.234.567");
    expect(formataMilhar(123)).toBe("123");
  });

  test("deve remover caracteres não numéricos", () => {
    expect(formataMilhar("1a2b3c4567")).toBe("1.234.567");
    expect(formataMilhar("1.000,50")).toBe("100.050");
  });

  test("deve retornar undefined para valores null/undefined", () => {
    expect(formataMilhar(null)).toBeUndefined();
    expect(formataMilhar(undefined)).toBeUndefined();
  });

  test("deve lidar com strings vazias", () => {
    expect(formataMilhar("")).toBe("");
  });

  test("deve ser resistente a strings longas", () => {
    const longNumber = "12345678901234567890";
    expect(formataMilhar(longNumber)).toBe("12.345.678.901.234.567.890");
  });
});

describe("formataMilharDecimal", () => {
  test("deve formatar números corretamente", () => {
    expect(formataMilharDecimal(1000)).toBe("1.000,00");
    expect(formataMilharDecimal(1234567.89)).toBe("1.234.567,89");
    expect(formataMilharDecimal(123.45)).toBe("123,45");
    expect(formataMilharDecimal(0.99)).toBe("0,99");
  });

  test("deve retornar o próprio valor para undefined/null", () => {
    expect(formataMilharDecimal(null)).toBe(null);
    expect(formataMilharDecimal(undefined)).toBe(undefined);
  });

  test("deve lidar com valores zero", () => {
    expect(formataMilharDecimal(0)).toBe("0,00");
    expect(formataMilharDecimal(0.0)).toBe("0,00");
  });
});

describe("Testes para geradorUUID", () => {
  test("deve gerar um UUID no formato correto", () => {
    const uuid = geradorUUID();

    expect(uuid).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
    );
  });

  test("deve gerar UUIDs únicos em chamadas consecutivas", () => {
    const uuid1 = geradorUUID();
    const uuid2 = geradorUUID();
    const uuid3 = geradorUUID();

    expect(uuid1).not.toBe(uuid2);
    expect(uuid1).not.toBe(uuid3);
    expect(uuid2).not.toBe(uuid3);
  });
});
