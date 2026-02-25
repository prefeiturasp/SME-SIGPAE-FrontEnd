import { listaAlimentacoes, prioridadeAlimentacao } from "../helpers";

describe("Helpers - Relatório Financeiro", () => {
  describe("listaAlimentacoes", () => {
    it("TIPO A sem cieja deve retornar refeicao, lanche e lanche 4h", () => {
      const result = listaAlimentacoes("TIPO A", false);

      expect(result).toEqual(["refeicao", "lanche", "lanche 4h"]);
    });

    it("TIPO A com cieja deve retornar refeicao e lanche 4h", () => {
      const result = listaAlimentacoes("TIPO A", true);

      expect(result).toEqual(["refeicao", "lanche 4h"]);
    });

    it("TIPO diferente de A sem cieja deve retornar lanche e lanche 4h", () => {
      const result = listaAlimentacoes("TIPO B", false);

      expect(result).toEqual(["lanche", "lanche 4h"]);
    });

    it("TIPO diferente de A com cieja deve retornar apenas lanche 4h", () => {
      const result = listaAlimentacoes("TIPO B", true);

      expect(result).toEqual(["lanche 4h"]);
    });
  });

  describe("prioridadeAlimentacao", () => {
    it("deve retornar 0 para refeicao", () => {
      expect(prioridadeAlimentacao("Refeição")).toBe(0);
    });

    it("deve retornar 1 para refeicao cieja e cmct", () => {
      expect(prioridadeAlimentacao("Refeição CIEJA e CMCT")).toBe(1);
    });

    it("deve retornar 2 para refeicao eja", () => {
      expect(prioridadeAlimentacao("Refeição EJA")).toBe(2);
    });

    it("deve retornar 99 para outros tipos", () => {
      expect(prioridadeAlimentacao("Lanche")).toBe(99);
      expect(prioridadeAlimentacao("Refeição da Tarde")).toBe(99);
      expect(prioridadeAlimentacao("Outro Tipo")).toBe(99);
    });

    it("deve ignorar caixa alta/baixa e acentos", () => {
      expect(prioridadeAlimentacao("REFEICAO")).toBe(0);
      expect(prioridadeAlimentacao("refeicao cieja")).toBe(1);
      expect(prioridadeAlimentacao("refeicao eja")).toBe(2);
    });
  });
});
