import {
  formataPayload,
  carregarValores,
  formatarTotal,
  retornaTotal,
  normalizar,
  parseDate,
  limparTabelas,
  extrairConteudoEntreParenteses,
  extrairTiposAlimentacaoDasUnidades,
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
                uuid: "381aecc2-e1b2-4d26-a156-1834eec7f1dd",
                inicio: 0,
                fim: 1,
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
                uuid: "381aecc2-e1b2-4d26-a156-1834eec7f1dd",
                inicio: 0,
                fim: 1,
              },
              tipo_valor: "UNITARIO",
              valor: "10",
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
                uuid: "e3030bd1-2e85-4676-87b3-96b4032370d4",
              },
              tipo_valor: "UNITARIO",
              valor: "20",
            },
            {
              faixa_etaria: {
                __str__: "01 ano a 03 anos e 11 meses",
                uuid: "e3030bd1-2e85-4676-87b3-96b4032370d4",
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

    it("normalizar usa string vazia quando nenhum texto é informado", () => {
      expect(normalizar()).toBe("");
    });

    it("retornaTotal soma a partir do valor unitário quando o campo é reajuste", () => {
      const total = retornaTotal("2", "valor_unitario_reajuste", {
        valor_unitario: "10",
      });
      expect(total).toBe("12,00");
    });

    it("parseDate converte data válida e retorna null sem texto", () => {
      expect(parseDate("")).toBeNull();
      expect(parseDate(null)).toBeNull();
      const data = parseDate("15/03/2026");
      expect(data.getFullYear()).toBe(2026);
      expect(data.getMonth()).toBe(2);
      expect(data.getDate()).toBe(15);
    });

    it("limparTabelas preserva identificadores e zera os demais campos", () => {
      const resultado = limparTabelas({
        Alimentacao: {
          Lanche: {
            tipo_alimentacao: "uuid-lanche",
            valor_unitario: "10",
            valor_unitario_total: "12",
          },
          Faixa: {
            faixa_etaria: "uuid-faixa",
            percentual_acrescimo: "5",
          },
        },
      });

      expect(resultado.Alimentacao.Lanche).toEqual({
        tipo_alimentacao: "uuid-lanche",
        valor_unitario: "",
        valor_unitario_total: "",
      });
      expect(resultado.Alimentacao.Faixa).toEqual({
        faixa_etaria: "uuid-faixa",
        percentual_acrescimo: "",
      });
    });

    it("extrai o conteúdo entre parênteses e retorna vazio sem ocorrência", () => {
      expect(extrairConteudoEntreParenteses("Grupo 2 (CEMEI, CEU)")).toBe(
        "CEMEI, CEU",
      );
      expect(extrairConteudoEntreParenteses("Grupo sem parenteses")).toBe("");
      expect(extrairConteudoEntreParenteses("Grupo ()")).toBe("");
    });

    it("extrai tipos de alimentação únicos das unidades informadas", () => {
      const tipos = extrairTiposAlimentacaoDasUnidades(
        ["CEI", "INEXISTENTE"],
        [
          {
            iniciais: "CEI",
            periodos_escolares: [
              {
                tipos_alimentacao: [
                  { uuid: "a", nome: "Lanche" },
                  { uuid: "a", nome: "Lanche" },
                ],
              },
              {
                tipos_alimentacao: [{ uuid: "b", nome: "Refeição" }],
              },
            ],
          },
        ],
      );

      expect(tipos).toEqual([
        { uuid: "a", nome: "Lanche" },
        { uuid: "b", nome: "Refeição" },
      ]);
      expect(extrairTiposAlimentacaoDasUnidades([], [])).toEqual([]);
    });
  });

  describe("ramos adicionais de formataPayload e carregarValores", () => {
    it("remove o marcador CEI e mantém período nulo quando a tabela não tem período", () => {
      const result = formataPayload({
        tabelas: {
          "Preço das Alimentações - CEI - Período Integral": {
            Lanche: {
              tipo_alimentacao: "uuid-lanche",
              valor_unitario: null,
              valor_unitario_reajuste: undefined,
              percentual_acrescimo: undefined,
            },
          },
          "Tabela sem período": {
            Ignorada: { valor_unitario: 1 },
            Valida: {
              faixa_etaria: "uuid-faixa",
              valor_unitario: 4,
            },
          },
        },
      });

      expect(result.tabelas[0]).toMatchObject({
        nome: "Preço das Alimentações",
        periodo_escolar: "INTEGRAL",
      });
      expect(result.tabelas[0].valores[0].valor).toBeNull();
      expect(result.tabelas[1]).toMatchObject({
        nome: "Tabela sem período",
        periodo_escolar: null,
      });
      expect(result.tabelas[1].valores).toHaveLength(1);
    });

    it("monta chaves de pendência dos grupos 2 e 5 e renomeia refeições do grupo 4", () => {
      const faixa = {
        nome: "Dietas Tipo A",
        periodo_escolar: null,
        valores: [
          {
            faixa_etaria: { __str__: "01 a 03 meses", uuid: "faixa-1" },
            tipo_valor: "UNITARIO",
            valor: "1",
          },
        ],
      };

      const grupo2 = carregarValores([faixa], "Grupo 2", "grupo 1");
      expect(
        grupo2["Dietas Tipo A - Turma Infantil - EMEI"]["01 a 03 meses"],
      ).toBeDefined();

      const grupo5Fundamental = carregarValores(
        [{ ...faixa, nome: "Dietas Tipo B" }],
        "Grupo 5",
        "grupo 3",
      );
      expect(
        grupo5Fundamental["Dietas Tipo B - EMEBS Fundamental"],
      ).toBeDefined();

      const grupo5Infantil = carregarValores(
        [{ ...faixa, nome: "Dietas Tipo B" }],
        "Grupo 5",
        "grupo 4",
      );
      expect(grupo5Infantil["Dietas Tipo B - EMEBS Infantil"]).toBeDefined();

      expect(() =>
        carregarValores([faixa], "Grupo 5", "grupo 1"),
      ).not.toThrow();

      const grupo4 = carregarValores(
        [
          {
            nome: "Preço das Alimentações",
            periodo_escolar: null,
            valores: [
              {
                tipo_alimentacao: { nome: "Refeição", uuid: "ref" },
                nome_campo: "Refeição_EMEF",
                tipo_valor: "UNITARIO",
                valor: "1",
              },
              {
                tipo_alimentacao: { nome: "Refeição", uuid: "ref" },
                nome_campo: "Dieta_Enteral_EMEFM",
                tipo_valor: "REAJUSTE",
                valor: "2",
              },
              {
                tipo_alimentacao: { nome: "Refeição", uuid: "ref" },
                nome_campo: "refeicao_eja",
                tipo_valor: "UNITARIO",
                valor: "3",
              },
              {
                tipo_alimentacao: { nome: "Refeição", uuid: "ref" },
                nome_campo: "Dieta_Enteral_EJA",
                tipo_valor: "ACRESCIMO",
                valor: "4",
              },
              {
                tipo_alimentacao: { nome: "Lanche", uuid: "lan" },
                nome_campo: "lanche_extra",
                tipo_valor: "DESCONHECIDO",
                valor: "5",
              },
              {
                tipo_alimentacao: "uuid-string",
                nome_campo: "outro",
                tipo_valor: "UNITARIO",
                valor: "6",
              },
            ],
          },
        ],
        "Grupo 4",
      );

      const tabela = grupo4["Preço das Alimentações"];
      expect(
        tabela["Refeição - CEU EMEF, CEU GESTÃO, EMEF, EMEFM"].valor_unitario,
      ).toBe("1");
      expect(
        tabela["Refeição - Dieta Enteral - CEU EMEF, CEU GESTÃO, EMEF, EMEFM"]
          .valor_unitario_reajuste,
      ).toBe("2");
      expect(tabela["Refeição - EJA"].valor_unitario).toBe("3");
      expect(
        tabela["Refeição - Dieta Enteral - EJA"].percentual_acrescimo,
      ).toBe("4");
      expect(tabela.Lanche.tipo_alimentacao).toBe("lan");
      expect(tabela["undefined"].tipo_alimentacao).toBe("uuid-string");
    });

    it("calcula total zero, ignora total inválido e aceita faixa sem objeto", () => {
      const somenteUnitario = carregarValores(
        [
          {
            nome: "Dietas Tipo B",
            periodo_escolar: null,
            valores: [
              {
                faixa_etaria: "faixa-uuid",
                tipo_valor: "UNITARIO",
                valor: "8",
              },
            ],
          },
        ],
        "Grupo 1",
      );
      expect(
        somenteUnitario["Dietas Tipo B"]["undefined"].valor_unitario_total,
      ).toBe("0,00");
      expect(somenteUnitario["Dietas Tipo B"]["undefined"].faixa_etaria).toBe(
        "faixa-uuid",
      );

      const invalido = carregarValores(
        [
          {
            nome: "Dietas Tipo B",
            periodo_escolar: null,
            valores: [
              {
                faixa_etaria: { __str__: "faixa", uuid: "f" },
                tipo_valor: "UNITARIO",
                valor: "abc",
              },
              {
                faixa_etaria: { __str__: "faixa", uuid: "f" },
                tipo_valor: "REAJUSTE",
                valor: "1",
              },
            ],
          },
        ],
        "Grupo 1",
      );
      expect(
        invalido["Dietas Tipo B"].faixa.valor_unitario_total,
      ).toBeUndefined();

      const semSoma = carregarValores(
        [
          {
            nome: "Dietas Tipo B",
            periodo_escolar: null,
            valores: [
              {
                faixa_etaria: { __str__: "faixa", uuid: "f" },
                tipo_valor: "REAJUSTE",
                valor: null,
              },
            ],
          },
        ],
        "Grupo 1",
      );
      expect(semSoma["Dietas Tipo B"].faixa.valor_unitario_total).toBe("0,00");

      const semGrupo4 = carregarValores(
        [
          {
            nome: "Preço das Alimentações",
            periodo_escolar: null,
            valores: [
              {
                tipo_alimentacao: { nome: "Lanche", uuid: "lanche" },
                nome_campo: "lanche",
                tipo_valor: "UNITARIO",
                valor: "9",
              },
              {
                nome_campo: "outro_campo",
                tipo_valor: "UNITARIO",
                valor: "1",
              },
            ],
          },
        ],
        "Grupo 1",
      );
      expect(semGrupo4["Preço das Alimentações"].Lanche.tipo_alimentacao).toBe(
        "lanche",
      );
    });
  });
});
