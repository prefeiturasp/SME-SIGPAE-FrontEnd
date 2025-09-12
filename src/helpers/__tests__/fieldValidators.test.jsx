import {
  alphaNumericAndSingleSpaceBetweenCharacters,
  noSpaceStartOrEnd,
  prefeituraEmail,
  SMEPrefeituraEmail,
} from "../fieldValidators";

describe("prefeituraEmail", () => {
  test("deve retornar undefined para emails válidos da prefeitura", () => {
    expect(prefeituraEmail("joao.silva@prefeitura.sp.gov.br")).toBeUndefined();
    expect(prefeituraEmail("maria@prefeitura.sp.gov.br")).toBeUndefined();
  });

  test("deve retornar mensagem de erro para emails inválidos", () => {
    expect(prefeituraEmail("joao@gmail.com")).toBe(
      "Somente emails da prefeitura de São Paulo"
    );
    expect(prefeituraEmail("joao@prefeitura.sp.gov.br.com")).toBe(
      "Somente emails da prefeitura de São Paulo"
    );
    expect(prefeituraEmail("@prefeitura.sp.gov.br")).toBe(
      "Somente emails da prefeitura de São Paulo"
    );
    expect(prefeituraEmail("prefeitura.sp.gov.br")).toBe(
      "Somente emails da prefeitura de São Paulo"
    );
  });

  test("deve retornar mensagem de erro para valor vazio ou undefined", () => {
    expect(prefeituraEmail("")).toBe(
      "Somente emails da prefeitura de São Paulo"
    );
    expect(prefeituraEmail(null)).toBe(
      "Somente emails da prefeitura de São Paulo"
    );
    expect(prefeituraEmail(undefined)).toBe(
      "Somente emails da prefeitura de São Paulo"
    );
  });
});

describe("SMEPrefeituraEmail", () => {
  test("deve retornar undefined para emails válidos da SME prefeitura", () => {
    expect(
      SMEPrefeituraEmail("professor.joao@sme.prefeitura.sp.gov.br")
    ).toBeUndefined();
    expect(
      SMEPrefeituraEmail("educador@sme.prefeitura.sp.gov.br")
    ).toBeUndefined();
    expect(SMEPrefeituraEmail("a@sme.prefeitura.sp.gov.br")).toBeUndefined();
  });

  test("deve retornar mensagem de erro para emails inválidos", () => {
    expect(SMEPrefeituraEmail("joao@gmail.com")).toBe(
      "Digite o E-mail @sme.prefeitura.sp.gov.br"
    );
    expect(SMEPrefeituraEmail("joao@sme.prefeitura.sp.gov.br.com")).toBe(
      "Digite o E-mail @sme.prefeitura.sp.gov.br"
    );
    expect(SMEPrefeituraEmail("@sme.prefeitura.sp.gov.br")).toBe(
      "Digite o E-mail @sme.prefeitura.sp.gov.br"
    );
    expect(SMEPrefeituraEmail("sme.prefeitura.sp.gov.br")).toBe(
      "Digite o E-mail @sme.prefeitura.sp.gov.br"
    );
    expect(SMEPrefeituraEmail("joao@prefeitura.sp.gov.br")).toBe(
      "Digite o E-mail @sme.prefeitura.sp.gov.br"
    );
  });

  test("deve retornar mensagem de erro para valor vazio ou undefined", () => {
    expect(SMEPrefeituraEmail("")).toBe(
      "Digite o E-mail @sme.prefeitura.sp.gov.br"
    );
    expect(SMEPrefeituraEmail(null)).toBe(
      "Digite o E-mail @sme.prefeitura.sp.gov.br"
    );
    expect(SMEPrefeituraEmail(undefined)).toBe(
      "Digite o E-mail @sme.prefeitura.sp.gov.br"
    );
  });
});

describe("noSpaceStartOrEnd", () => {
  test("deve retornar undefined para strings sem espaços no início ou fim", () => {
    expect(noSpaceStartOrEnd("texto")).toBeUndefined();
    expect(noSpaceStartOrEnd("texto normal")).toBeUndefined();
    expect(noSpaceStartOrEnd("texto com espaços no meio")).toBeUndefined();
  });

  test("deve retornar mensagem de erro para strings com espaços no início", () => {
    expect(noSpaceStartOrEnd(" texto")).toBe(
      "Remover espaço do início e/ou final"
    );
    expect(noSpaceStartOrEnd("   texto com espaços no início")).toBe(
      "Remover espaço do início e/ou final"
    );
  });

  test("deve retornar mensagem de erro para strings com espaços no final", () => {
    expect(noSpaceStartOrEnd("texto ")).toBe(
      "Remover espaço do início e/ou final"
    );
    expect(noSpaceStartOrEnd("texto com espaços no final   ")).toBe(
      "Remover espaço do início e/ou final"
    );
  });

  test("deve retornar mensagem de erro para strings com espaços no início e final", () => {
    expect(noSpaceStartOrEnd(" texto ")).toBe(
      "Remover espaço do início e/ou final"
    );
    expect(noSpaceStartOrEnd("   texto com espaços   ")).toBe(
      "Remover espaço do início e/ou final"
    );
  });

  test("deve retornar undefined para valores falsy", () => {
    expect(noSpaceStartOrEnd(null)).toBeUndefined();
    expect(noSpaceStartOrEnd(undefined)).toBeUndefined();
    expect(noSpaceStartOrEnd("")).toBeUndefined();
  });
});

describe("alphaNumericAndSingleSpaceBetweenCharacters", () => {
  test("deve retornar undefined para strings válidas", () => {
    expect(
      alphaNumericAndSingleSpaceBetweenCharacters("abc123")
    ).toBeUndefined();
    expect(
      alphaNumericAndSingleSpaceBetweenCharacters("ABC123")
    ).toBeUndefined();
    expect(
      alphaNumericAndSingleSpaceBetweenCharacters("abc 123")
    ).toBeUndefined();
    expect(
      alphaNumericAndSingleSpaceBetweenCharacters("a1 b2 c3")
    ).toBeUndefined();
  });

  test('deve retornar "Apenas letras e números" para caracteres inválidos', () => {
    expect(alphaNumericAndSingleSpaceBetweenCharacters("abc!123")).toBe(
      "Apenas letras e números"
    );
    expect(alphaNumericAndSingleSpaceBetweenCharacters("abc@123")).toBe(
      "Apenas letras e números"
    );
    expect(alphaNumericAndSingleSpaceBetweenCharacters("abc_123")).toBe(
      "Apenas letras e números"
    );
    expect(alphaNumericAndSingleSpaceBetweenCharacters("abc-123")).toBe(
      "Apenas letras e números"
    );
  });

  test('deve retornar "Remover excesso de espaços" para múltiplos espaços consecutivos', () => {
    expect(alphaNumericAndSingleSpaceBetweenCharacters("abc  123")).toBe(
      "Remover excesso de espaços"
    );
    expect(alphaNumericAndSingleSpaceBetweenCharacters("  abc 123")).toBe(
      "Remover excesso de espaços"
    );
    expect(alphaNumericAndSingleSpaceBetweenCharacters("abc 123  ")).toBe(
      "Remover excesso de espaços"
    );
    expect(alphaNumericAndSingleSpaceBetweenCharacters("abc  123  def")).toBe(
      "Remover excesso de espaços"
    );
  });

  test("deve priorizar o erro de caracteres inválidos sobre o de espaços", () => {
    expect(alphaNumericAndSingleSpaceBetweenCharacters("abc!  123")).toBe(
      "Apenas letras e números"
    );
  });

  test("deve retornar undefined para valores falsy", () => {
    expect(alphaNumericAndSingleSpaceBetweenCharacters("")).toBeUndefined();
    expect(alphaNumericAndSingleSpaceBetweenCharacters(null)).toBeUndefined();
    expect(
      alphaNumericAndSingleSpaceBetweenCharacters(undefined)
    ).toBeUndefined();
  });
});
