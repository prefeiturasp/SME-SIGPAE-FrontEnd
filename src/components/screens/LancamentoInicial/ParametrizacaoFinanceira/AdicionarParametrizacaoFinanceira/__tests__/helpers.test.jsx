import {
  formataPayload,
  carregarValores,
  formatarTotal,
  retornaTotal,
  normalizar,
} from "../helpers";

describe("Testes de Funções Helpers.tsx - Parametrização Financeira", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Método - formataPayload", () => {
    it("deve formatar corretamente o payload com tabelas e períodos", () => {
      const payload = {
        tabelas: {
          "Preço das Alimentações - Período Integral": {
            "01 ano a 01 anos e 12 meses": {
              tipo_alimentacao: { nome: "Normal" },
              faixa_etaria: { __str__: "01 ano a 01 anos e 12 meses" },
              valor_unitario: 10,
              valor_unitario_reajuste: 2,
            },
          },
        },
      };

      const result = formataPayload(payload);

      expect(result.tabelas).toHaveLength(1);
      expect(result.tabelas[0]).toMatchObject({
        nome: "Preço das Alimentações",
        periodo_escolar: "INTEGRAL",
      });

      const tipos = result.tabelas[0].valores.map((v) => v.tipo_valor);
      expect(tipos).toContain("UNITARIO");
      expect(tipos).toContain("REAJUSTE");
    });

    it("gera valor de acréscimo quando percentual_acrescimo existe", () => {
      const payload = {
        tabelas: {
          "Preço das Alimentações - Período Parcial": {
            "01 ano a 03 anos e 11 meses": {
              tipo_alimentacao: { nome: "Normal" },
              faixa_etaria: { __str__: "01 ano a 03 anos e 11 meses" },
              percentual_acrescimo: 10,
            },
          },
        },
      };

      const result = formataPayload(payload);
      expect(result.tabelas[0].valores[0].tipo_valor).toBe("ACRESCIMO");
    });

    it("deve ignorar campos undefined em gerarValores", () => {
      const payload = {
        tabelas: {
          "Preço das Alimentações - Período Parcial": {
            "01 ano a 03 anos e 11 meses": {
              tipo_alimentacao: { nome: "Normal" },
              faixa_etaria: { __str__: "01 ano a 03 anos e 11 meses" },
              valor_unitario: undefined,
              valor_unitario_reajuste: undefined,
            },
          },
        },
      };

      const result = formataPayload(payload);
      expect(result.tabelas[0].valores).toHaveLength(0);
    });

    it("deve retornar payload vazio corretamente quando não há tabelas", () => {
      const result = formataPayload({ tabelas: {} });
      expect(result.tabelas).toEqual([]);
    });
  });

  describe("Método - carregarValores", () => {
    it("monta chave correta para Grupo 2 com CEI", () => {
      const tabelas = [
        {
          nome: "Preço das Alimentações",
          periodo_escolar: "INTEGRAL",
          valores: [
            {
              faixa_etaria: {
                __str__: "01 a 03 meses",
                uuid: "uuid-faixa-1",
              },
              tipo_valor: "UNITARIO",
              valor: "10",
            },
          ],
        },
      ];

      const result = carregarValores(tabelas, "Grupo 2");

      expect(
        result["Preço das Alimentações - CEI - Período Integral"],
      ).toBeDefined();
    });

    it("calcula total unitário + reajuste corretamente", () => {
      const tabelas = [
        {
          nome: "Preço das Alimentações",
          periodo_escolar: "INTEGRAL",
          valores: [
            {
              faixa_etaria: {
                __str__: "01 a 03 meses",
                uuid: "uuid-faixa-1",
              },
              tipo_valor: "UNITARIO",
              valor: "10",
            },
            {
              faixa_etaria: {
                __str__: "01 a 03 meses",
                uuid: "uuid-faixa-1",
              },
              tipo_valor: "REAJUSTE",
              valor: "2",
            },
          ],
        },
      ];

      const result = carregarValores(tabelas, "Grupo 1");

      expect(
        result["Preço das Alimentações - Período Integral"]["01 a 03 meses"]
          .valor_unitario_total,
      ).toBe("12,00");
    });

    it("deve calcular valor total com percentual de acréscimo", () => {
      const tabelas = [
        {
          nome: "Preço das Alimentações",
          periodo_escolar: "PARCIAL",
          valores: [
            {
              faixa_etaria: {
                __str__: "01 ano a 03 anos e 11 meses",
                uuid: "uuid-faixa-2",
              },
              tipo_valor: "UNITARIO",
              valor: "20",
            },
            {
              faixa_etaria: {
                __str__: "01 ano a 03 anos e 11 meses",
                uuid: "uuid-faixa-2",
              },
              tipo_valor: "ACRESCIMO",
              valor: "10",
            },
          ],
        },
      ];

      const result = carregarValores(tabelas, "Grupo 1");

      expect(
        result["Preço das Alimentações - Período Parcial"][
          "01 ano a 03 anos e 11 meses"
        ].valor_unitario_total,
      ).toBe("22,00");
    });

    it("cria corretamente o Kit Lanche", () => {
      const tabelas = [
        {
          nome: "Preço das Alimentações",
          periodo_escolar: null,
          valores: [
            {
              nome_campo: "kit_lanche",
              tipo_valor: "UNITARIO",
              valor: "5",
            },
          ],
        },
      ];

      const result = carregarValores(tabelas, "Grupo 1");

      expect(result["Preço das Alimentações"]["Kit Lanche"]).toHaveProperty(
        "valor_unitario",
        "5",
      );
    });

    it("não quebra quando valores são nulos", () => {
      const tabelas = [
        {
          nome: "Dietas Tipo B",
          periodo_escolar: "INTEGRAL",
          valores: [
            {
              faixa_etaria: {
                __str__: "01 a 03 meses",
                uuid: "381aecc2-e1b2-4d26-a156-1834eec7f1dd",
                inicio: 1,
                fim: 4,
              },
              tipo_valor: "UNITARIO",
              valor: null,
            },
          ],
        },
      ];

      const result = carregarValores(tabelas, "Grupo 1");

      expect(
        result["Dietas Tipo B - Período Integral"]["01 a 03 meses"],
      ).toHaveProperty("faixa_etaria", "381aecc2-e1b2-4d26-a156-1834eec7f1dd");
    });
  });

  describe("helpers utilitários", () => {
    it("formatarTotal formata corretamente", () => {
      expect(formatarTotal(10)).toBe("10,00");
      expect(formatarTotal(10.5)).toBe("10,50");
    });

    it("retornaTotal soma unitário e reajuste", () => {
      const registro = {
        valor_unitario: "10",
        valor_unitario_reajuste: "2",
      };

      const total = retornaTotal("10", "valor_unitario", registro);
      expect(total).toBe("12,00");
    });

    it("retornaTotal retorna null quando não há soma válida", () => {
      const total = retornaTotal("0", "valor_unitario", {});
      expect(total).toBeNull();
    });

    it("normaliza corretamente strings com acento", () => {
      expect(normalizar("Refeição ÁÇÊ")).toBe("refeicao ace");
    });
  });
});
