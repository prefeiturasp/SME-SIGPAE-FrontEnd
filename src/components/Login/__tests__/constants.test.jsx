import { TIPOS_EMAIL_CADASTRO, TABS } from "../constans";
import { vi } from "vitest";

describe("Constantes do módulo de Login", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("deve conter dois tipos de e-mail válidos com nome e uuid", () => {
    expect(Array.isArray(TIPOS_EMAIL_CADASTRO)).toBe(true);
    expect(TIPOS_EMAIL_CADASTRO).toHaveLength(2);

    expect(TIPOS_EMAIL_CADASTRO[0]).toEqual({
      nome: "@sme.prefeitura.sp.gov.br",
      uuid: 0,
    });

    expect(TIPOS_EMAIL_CADASTRO[1]).toEqual({
      nome: "@prefeitura.sp.gov.br",
      uuid: 1,
    });
  });

  it("deve conter as abas esperadas no objeto TABS", () => {
    expect(typeof TABS).toBe("object");

    expect(TABS.ESCOLA).toBe("ESCOLA");
    expect(TABS.DRE_CODAE).toBe("DRE/CODAE");
    expect(TABS.TERCEIRIZADAS).toBe("EMPRESA");
    expect(TABS.PRIMEIRO_ACESSO).toBe("PRIMEIRO_ACESSO");
  });

  it("deve ter exatamente 4 abas definidas", () => {
    expect(Object.keys(TABS)).toHaveLength(4);
    expect(Object.values(TABS)).toEqual(
      expect.arrayContaining([
        "ESCOLA",
        "DRE/CODAE",
        "EMPRESA",
        "PRIMEIRO_ACESSO",
      ])
    );
  });
});
