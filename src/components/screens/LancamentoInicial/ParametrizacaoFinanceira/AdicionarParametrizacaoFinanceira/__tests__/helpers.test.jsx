import { formataPayload, carregarValores } from "../helpers";

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
        outroCampo: "teste",
      };

      const result = formataPayload(payload);
      expect(result.tabelas).toHaveLength(1);
      expect(result.tabelas[0]).toMatchObject({
        nome: "Preço das Alimentações",
        periodo_escolar: "INTEGRAL",
      });
      expect(result.tabelas[0].valores[0]).toHaveProperty(
        "tipo_valor",
        "REAJUSTE",
      );
      expect(result.tabelas[0].valores[1]).toHaveProperty(
        "tipo_valor",
        "UNITARIO",
      );
    });

    it("deve ignorar campos undefined em gerarValores", () => {
      const payload = {
        tabelas: {
          "Preço das Alimentações - Período Parcial": {
            "01 ano a 03 anos e 11 meses": {
              tipo_alimentacao: null,
              faixa_etaria: { __str__: "01 ano a 03 anos e 11 meses" },
              valor_unitario: undefined,
              valor_unitario_reajuste: undefined,
              percentual_acrescimo: 10,
            },
          },
        },
      };

      const result = formataPayload(payload);
      expect(result.tabelas[0].valores).toHaveLength(1);
    });

    it("deve retornar payload vazio corretamente quando não há tabelas", () => {
      const result = formataPayload({ tabelas: {} });
      expect(result.tabelas).toEqual([]);
    });
  });

  describe("Método - carregarValores", () => {
    it("deve carregar valores e montar objeto corretamente (unitário + reajuste)", () => {
      const tabelas = [
        {
          nome: "Preço das Alimentações",
          periodo_escolar: "INTEGRAL",
          valores: [
            {
              faixa_etaria: {
                __str__: "01 a 03 meses",
                uuid: "381aecc2-e1b2-4d26-a156-1834eec7f1dd",
                inicio: 0,
                fim: 1,
              },
              tipo_valor: "UNITARIO",
              valor: "10",
              tipo_alimentacao: null,
            },
            {
              faixa_etaria: {
                __str__: "01 a 03 meses",
                uuid: "381aecc2-e1b2-4d26-a156-1834eec7f1dd",
                inicio: 1,
                fim: 4,
              },
              tipo_valor: "REAJUSTE",
              valor: "2",
              tipo_alimentacao: null,
            },
          ],
        },
      ];

      const resultado = carregarValores(tabelas);
      const faixa =
        resultado["Preço das Alimentações - Período Integral"]["01 a 03 meses"];
      expect(faixa.valor_unitario_total).toBe("12,00");
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
                uuid: "e3030bd1-2e85-4676-87b3-96b4032370d4",
              },
              tipo_valor: "UNITARIO",
              valor: "20",
              tipo_alimentacao: null,
            },
            {
              faixa_etaria: {
                __str__: "01 ano a 03 anos e 11 meses",
                uuid: "e3030bd1-2e85-4676-87b3-96b4032370d4",
              },
              tipo_valor: "ACRESCIMO",
              valor: "10",
              tipo_alimentacao: null,
            },
          ],
        },
      ];

      const result = carregarValores(tabelas);
      const faixa =
        result["Preço das Alimentações - Período Parcial"][
          "01 ano a 03 anos e 11 meses"
        ];
      expect(faixa.valor_unitario_total).toBe("22,00");
    });

    it("não deve quebrar se todos os valores forem nulos", () => {
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
              tipo_alimentacao: null,
            },
          ],
        },
      ];

      const result = carregarValores(tabelas);
      expect(
        result["Dietas Tipo B - Período Integral"]["01 a 03 meses"],
      ).toHaveProperty("faixa_etaria", "381aecc2-e1b2-4d26-a156-1834eec7f1dd");
    });
  });
});
