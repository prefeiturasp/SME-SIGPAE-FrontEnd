import {
  chaveCampoConsumo,
  chaveLinhaTipoAlimentacao,
  formataPercentual,
  listaAlimentacoes,
  obterValorParametrizado,
  prioridadeAlimentacao,
} from "../helpers";

describe("Helpers - Relatório Financeiro", () => {
  describe("formataPercentual", () => {
    it("formata inteiros e decimais no padrão brasileiro", () => {
      expect(formataPercentual(5)).toBe("5%");
      expect(formataPercentual(2.5)).toBe("2,5%");
      expect(formataPercentual(12.346)).toBe("12,35%");
    });

    it("trata ausência de valor como 0%", () => {
      expect(formataPercentual(null)).toBe("0%");
      expect(formataPercentual(undefined)).toBe("0%");
    });
  });

  describe("chaveCampoConsumo", () => {
    it("remove acentos, normaliza caixa e troca espaços por underscore", () => {
      expect(chaveCampoConsumo("Refeição")).toBe("refeicao");
      expect(chaveCampoConsumo("Lanche 4h")).toBe("lanche_4h");
      expect(chaveCampoConsumo("Kit Lanche")).toBe("kit_lanche");
      expect(chaveCampoConsumo("Lanche  Emergencial")).toBe(
        "lanche_emergencial",
      );
    });
  });

  describe("chaveLinhaTipoAlimentacao", () => {
    it("diferencia tipos com o mesmo uuid pelo tipo de refeição", () => {
      expect(
        chaveLinhaTipoAlimentacao({ uuid: "x", nome: "Refeição" }),
      ).not.toBe(
        chaveLinhaTipoAlimentacao({
          uuid: "x",
          nome: "Refeição EJA",
          tipo_refeicao: "eja",
        }),
      );
    });
  });

  describe("obterValorParametrizado", () => {
    const tabela = {
      nome: "Preço das Alimentações",
      periodo_escolar: null,
      valores: [
        {
          tipo_alimentacao: { uuid: "a" },
          tipo_valor: "UNITARIO",
          valor: "9,54",
        },
        {
          tipo_alimentacao: { uuid: "a" },
          tipo_valor: "REAJUSTE",
          valor: "0,16",
        },
      ],
    };

    it("retorna o valor cadastrado sem perda de precisão", () => {
      const tipo = { uuid: "a", nome: "Lanche" };

      expect(obterValorParametrizado(tabela, tipo, "UNITARIO")).toBe(9.54);
      expect(obterValorParametrizado(tabela, tipo, "REAJUSTE")).toBe(0.16);
    });

    it("retorna 0 quando não há tabela ou valor cadastrado", () => {
      const tipo = { uuid: "a", nome: "Lanche" };

      expect(obterValorParametrizado(undefined, tipo, "UNITARIO")).toBe(0);
      expect(obterValorParametrizado(tabela, tipo, "ACRESCIMO")).toBe(0);
    });
  });

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
      expect(prioridadeAlimentacao("Lanche")).toBe(3);
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
