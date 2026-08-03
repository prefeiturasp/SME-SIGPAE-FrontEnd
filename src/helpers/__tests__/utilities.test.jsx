import {
  formataMilhar,
  formataMilharDecimal,
  geradorUUID,
  formatarCPFouCNPJ,
} from "../utilities";

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
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
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

describe("formatarCPFouCNPJ", () => {
  test("deve formatar CNPJ numérico antigo (14 dígitos)", () => {
    expect(formatarCPFouCNPJ("12345678000195")).toBe("12.345.678/0001-95");
  });

  test("deve formatar CNPJ alfanumérico (com letras nos primeiros 12 caracteres)", () => {
    expect(formatarCPFouCNPJ("12AB3456789012")).toBe("12.AB3.456/7890-12");
    expect(formatarCPFouCNPJ("AA112233445566")).toBe("AA.112.233/4455-66");
  });

  test("deve formatar CNPJ com letras minúsculas", () => {
    expect(formatarCPFouCNPJ("12ab3456789012")).toBe("12.AB3.456/7890-12");
  });

  test("deve formatar CNPJ já formatado corretamente", () => {
    expect(formatarCPFouCNPJ("12.345.678/0001-95")).toBe("12.345.678/0001-95");
    expect(formatarCPFouCNPJ("12.AB3.456/7890-12")).toBe("12.AB3.456/7890-12");
  });

  test("deve formatar CPF (11 dígitos)", () => {
    expect(formatarCPFouCNPJ("12345678901")).toBe("123.456.789-01");
    expect(formatarCPFouCNPJ("52998224725")).toBe("529.982.247-25");
  });

  test("deve retornar string sem formatação se não tiver 11 ou 14 caracteres", () => {
    expect(formatarCPFouCNPJ("123")).toBe("123");
    expect(formatarCPFouCNPJ("")).toBe("");
  });

  test("deve rejeitar CNPJ com letras nos dígitos verificadores (últimos 2)", () => {
    expect(formatarCPFouCNPJ("12.345.678/0001-A5")).not.toMatch(/-[A-Z]/);
    expect(formatarCPFouCNPJ("1234567890AB")).toBe("1234567890AB");
  });
});
