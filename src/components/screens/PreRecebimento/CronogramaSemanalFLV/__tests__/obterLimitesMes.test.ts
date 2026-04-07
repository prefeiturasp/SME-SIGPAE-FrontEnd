import { obterLimitesMes } from "../components/Cadastrar/helpers";

describe("obterLimitesMes", () => {
  it("retorna limites corretos para janeiro de 2026", () => {
    const result = obterLimitesMes("01/2026");
    expect(result.minDate).not.toBeNull();
    expect(result.maxDate).not.toBeNull();
    expect(result.minDate?.getDate()).toBe(1);
    expect(result.minDate?.getMonth()).toBe(0);
    expect(result.minDate?.getFullYear()).toBe(2026);
    expect(result.maxDate?.getDate()).toBe(31);
    expect(result.maxDate?.getMonth()).toBe(0);
    expect(result.maxDate?.getFullYear()).toBe(2026);
  });

  it("retorna limites corretos para fevereiro de 2026 (28 dias)", () => {
    const result = obterLimitesMes("02/2026");
    expect(result.minDate).not.toBeNull();
    expect(result.maxDate).not.toBeNull();
    expect(result.minDate?.getDate()).toBe(1);
    expect(result.minDate?.getMonth()).toBe(1);
    expect(result.maxDate?.getDate()).toBe(28);
  });

  it("retorna limites corretos para fevereiro de 2024 (ano bissexto - 29 dias)", () => {
    const result = obterLimitesMes("02/2024");
    expect(result.minDate).not.toBeNull();
    expect(result.maxDate).not.toBeNull();
    expect(result.minDate?.getDate()).toBe(1);
    expect(result.maxDate?.getDate()).toBe(29);
  });

  it("retorna limites corretos para abril de 2026 (30 dias)", () => {
    const result = obterLimitesMes("04/2026");
    expect(result.minDate).not.toBeNull();
    expect(result.maxDate).not.toBeNull();
    expect(result.maxDate?.getDate()).toBe(30);
  });

  it("retorna null para formato invalido sem barra", () => {
    const result = obterLimitesMes("012026");
    expect(result.minDate).toBeNull();
    expect(result.maxDate).toBeNull();
  });

  it("retorna null para formato invalido com barra invertida", () => {
    const result = obterLimitesMes("01\\2026");
    expect(result.minDate).toBeNull();
    expect(result.maxDate).toBeNull();
  });

  it("retorna null para string vazia", () => {
    const result = obterLimitesMes("");
    expect(result.minDate).toBeNull();
    expect(result.maxDate).toBeNull();
  });

  it("retorna null para null", () => {
    const result = obterLimitesMes(null as any);
    expect(result.minDate).toBeNull();
    expect(result.maxDate).toBeNull();
  });

  it("retorna null para undefined", () => {
    const result = obterLimitesMes(undefined as any);
    expect(result.minDate).toBeNull();
    expect(result.maxDate).toBeNull();
  });

  it("retorna null para formato com apenas um digito no mes", () => {
    const result = obterLimitesMes("1/2026");
    expect(result.minDate).toBeNull();
    expect(result.maxDate).toBeNull();
  });

  it("retorna null para formato com apenas um digito no ano", () => {
    const result = obterLimitesMes("01/26");
    expect(result.minDate).toBeNull();
    expect(result.maxDate).toBeNull();
  });

  it("retorna limites corretos para dezembro de 2026", () => {
    const result = obterLimitesMes("12/2026");
    expect(result.minDate).not.toBeNull();
    expect(result.maxDate).not.toBeNull();
    expect(result.minDate?.getMonth()).toBe(11);
    expect(result.maxDate?.getDate()).toBe(31);
  });
});
