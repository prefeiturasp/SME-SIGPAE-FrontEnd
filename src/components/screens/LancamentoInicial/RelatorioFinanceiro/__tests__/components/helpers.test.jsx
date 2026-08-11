import {
  formatarPayload,
  getValorUnitario,
  getValoresDescontos,
} from "../../components/ModalAplicarDesconto/helpers";

describe("Helpers de descontos financeiros", () => {
  describe("formatarPayload", () => {
    const descontoBase = {
      tipo_lancamento: "ALIMENTACOES",
      faixa_etaria: "",
      tipo_alimentacao: "uuid-alimentacao",
      clausula_desconto: "uuid-clausula",
      quantidade: 10,
      valor_unitario: 5,
      total_desconto: 10,
      periodo_escolar: "",
      unidades_educacionais: [],
    };

    it("deve formatar faixa etária e período escolar", () => {
      const desconto = {
        ...descontoBase,
        faixa_etaria: "INTEGRAL|uuid-faixa",
      };

      const [resultado] = formatarPayload([desconto], {
        ehCei: true,
        ehCemei: false,
        ehEmef: false,
        ehEmebs: false,
      });

      expect(resultado).toMatchObject({
        faixa_etaria: "uuid-faixa",
        periodo_escolar: "INTEGRAL",
      });
    });

    it("deve formatar alimentação EJA para EMEF", () => {
      const desconto = {
        ...descontoBase,
        tipo_alimentacao: "NOITE|uuid-refeicao",
      };

      const [resultado] = formatarPayload([desconto], {
        ehCei: false,
        ehCemei: false,
        ehEmef: true,
        ehEmebs: false,
      });

      expect(resultado).toMatchObject({
        tipo_alimentacao: "uuid-refeicao",
        periodo_escolar: "NOITE",
      });
    });

    it("deve separar tipo de unidade e tipo de lançamento para CEMEI", () => {
      const desconto = {
        ...descontoBase,
        tipo_lancamento: "CEI|ALIMENTACOES",
      };

      const [resultado] = formatarPayload([desconto], {
        ehCei: false,
        ehCemei: true,
        ehEmef: false,
        ehEmebs: false,
      });

      expect(resultado).toMatchObject({
        tipo_lancamento: "ALIMENTACOES",
        cei_ou_emei: "CEI",
      });
    });

    it("deve separar turma e tipo de lançamento para EMEBS", () => {
      const desconto = {
        ...descontoBase,
        tipo_lancamento: "INFANTIL|ALIMENTACOES",
      };

      const [resultado] = formatarPayload([desconto], {
        ehCei: false,
        ehCemei: false,
        ehEmef: false,
        ehEmebs: true,
      });

      expect(resultado).toMatchObject({
        tipo_lancamento: "ALIMENTACOES",
        infantil_ou_fundamental: "INFANTIL",
      });
    });

    it("deve manter o tipo de lançamento quando não for CEMEI nem EMEBS", () => {
      const [resultado] = formatarPayload([descontoBase], {
        ehCei: true,
        ehCemei: false,
        ehEmef: false,
        ehEmebs: false,
      });

      expect(resultado.tipo_lancamento).toBe("ALIMENTACOES");
    });
  });

  describe("getValoresDescontos", () => {
    const descontoBase = {
      tipo_lancamento: "ALIMENTACOES",
      faixa_etaria: "uuid-faixa",
      tipo_alimentacao: "uuid-alimentacao",
      clausula_desconto: "uuid-clausula",
      quantidade: 10,
      valor_unitario: 5,
      total_desconto: 10,
      periodo_escolar: "",
      unidades_educacionais: [],
    };

    it("deve formatar desconto de EMEF com período escolar na alimentação", () => {
      const desconto = {
        ...descontoBase,
        periodo_escolar: "NOITE",
      };

      const resultado = getValoresDescontos(desconto, {
        ehEmef: true,
      });

      expect(resultado.tipo_alimentacao).toBe("NOITE|uuid-alimentacao");
    });

    it("deve usar kit_lanche quando não houver alimentação nem faixa etária", () => {
      const desconto = {
        ...descontoBase,
        tipo_alimentacao: "",
        faixa_etaria: "",
      };

      const resultado = getValoresDescontos(desconto, {
        ehEmef: false,
      });

      expect(resultado.tipo_alimentacao).toBe("kit_lanche");
    });

    it("deve formatar faixa etária com período escolar", () => {
      const desconto = {
        ...descontoBase,
        periodo_escolar: "INTEGRAL",
        faixa_etaria: "uuid-faixa",
      };

      const resultado = getValoresDescontos(desconto, {
        ehEmef: false,
      });

      expect(resultado.faixa_etaria).toBe("INTEGRAL|uuid-faixa");
    });

    it("deve formatar tipo de lançamento para CEI", () => {
      const desconto = {
        ...descontoBase,
        cei_ou_emei: "CEI",
        tipo_lancamento: "ALIMENTACOES",
      };

      const resultado = getValoresDescontos(desconto, {
        ehEmef: false,
      });

      expect(resultado.tipo_lancamento).toBe("CEI|ALIMENTACOES");
    });

    it("deve formatar tipo de lançamento para EMEBS", () => {
      const desconto = {
        ...descontoBase,
        infantil_ou_fundamental: "INFANTIL",
        tipo_lancamento: "ALIMENTACOES",
      };

      const resultado = getValoresDescontos(desconto, {
        ehEmef: false,
      });

      expect(resultado.tipo_lancamento).toBe("INFANTIL|ALIMENTACOES");
    });
  });

  describe("getValorUnitario", () => {
    const faixasEtarias = [
      {
        uuid: "uuid-faixa",
        __str__: "1 a 3 anos",
      },
    ];

    const tiposAlimentacao = [
      {
        uuid: "uuid-refeicao",
        nome: "Refeição",
      },
      {
        uuid: "uuid-lanche",
        nome: "Lanche",
      },
    ];

    const criarTabela = ({ nome, periodo_escolar = null, valores }) => ({
      nome,
      periodo_escolar,
      valores,
    });

    it("deve retornar 0 quando não houver tipo de lançamento", () => {
      const resultado = getValorUnitario({
        desconto: {
          tipo_lancamento: "",
          faixa_etaria: "",
          tipo_alimentacao: "",
        },
        grupo: {
          ehCei: true,
          ehCemei: false,
          ehEmef: false,
          ehEmebs: false,
        },
        faixasEtarias,
        tiposAlimentacao,
        tabelas: [],
      });

      expect(resultado).toBe(0);
    });

    it("deve buscar o valor unitário pela faixa etária para CEI", () => {
      const resultado = getValorUnitario({
        desconto: {
          tipo_lancamento: "ALIMENTACOES",
          faixa_etaria: "INTEGRAL|uuid-faixa",
          tipo_alimentacao: "",
        },
        grupo: {
          ehCei: true,
          ehCemei: false,
          ehEmef: false,
          ehEmebs: false,
        },
        faixasEtarias,
        tiposAlimentacao,
        tabelas: [
          criarTabela({
            nome: "ALIMENTACOES",
            periodo_escolar: "INTEGRAL",
            valores: [
              {
                nome_campo: "1 a 3 anos",
                tipo_valor: "UNITARIO",
                valor: "12,50",
              },
            ],
          }),
        ],
      });

      expect(resultado).toBe(12.5);
    });

    it("deve retornar 0 quando a faixa etária não existir", () => {
      const resultado = getValorUnitario({
        desconto: {
          tipo_lancamento: "ALIMENTACOES",
          faixa_etaria: "INTEGRAL|faixa-inexistente",
          tipo_alimentacao: "",
        },
        grupo: {
          ehCei: true,
          ehCemei: false,
          ehEmef: false,
          ehEmebs: false,
        },
        faixasEtarias,
        tiposAlimentacao,
        tabelas: [],
      });

      expect(resultado).toBe(0);
    });

    it("deve buscar o valor unitário pela alimentação", () => {
      const resultado = getValorUnitario({
        desconto: {
          tipo_lancamento: "ALIMENTACOES",
          faixa_etaria: "",
          tipo_alimentacao: "uuid-lanche",
        },
        grupo: {
          ehCei: false,
          ehCemei: false,
          ehEmef: false,
          ehEmebs: false,
        },
        faixasEtarias,
        tiposAlimentacao,
        tabelas: [
          criarTabela({
            nome: "ALIMENTACOES",
            valores: [
              {
                nome_campo: "lanche",
                tipo_valor: "UNITARIO",
                valor: "8,75",
              },
            ],
          }),
        ],
      });

      expect(resultado).toBe(8.75);
    });

    it("deve buscar o valor de kit lanche", () => {
      const resultado = getValorUnitario({
        desconto: {
          tipo_lancamento: "ALIMENTACOES",
          faixa_etaria: "",
          tipo_alimentacao: "kit_lanche",
        },
        grupo: {
          ehCei: false,
          ehCemei: false,
          ehEmef: false,
          ehEmebs: false,
        },
        faixasEtarias,
        tiposAlimentacao,
        tabelas: [
          criarTabela({
            nome: "ALIMENTACOES",
            valores: [
              {
                nome_campo: "kit lanche",
                tipo_valor: "UNITARIO",
                valor: "15,00",
              },
            ],
          }),
        ],
      });

      expect(resultado).toBe(15);
    });

    it("deve buscar refeição EJA para EMEF", () => {
      const resultado = getValorUnitario({
        desconto: {
          tipo_lancamento: "ALIMENTACOES",
          faixa_etaria: "",
          tipo_alimentacao: "NOITE|uuid-refeicao",
        },
        grupo: {
          ehCei: false,
          ehCemei: false,
          ehEmef: true,
          ehEmebs: false,
        },
        faixasEtarias,
        tiposAlimentacao,
        tabelas: [
          criarTabela({
            nome: "ALIMENTACOES",
            periodo_escolar: "NOITE",
            valores: [
              {
                nome_campo: "refeicao eja",
                tipo_valor: "UNITARIO",
                valor: "20,00",
              },
            ],
          }),
        ],
      });

      expect(resultado).toBe(20);
    });

    it("deve buscar o valor específico do tipo de unidade para EMEBS", () => {
      const resultado = getValorUnitario({
        desconto: {
          tipo_lancamento: "INFANTIL|ALIMENTACOES",
          faixa_etaria: "",
          tipo_alimentacao: "uuid-lanche",
        },
        grupo: {
          ehCei: false,
          ehCemei: false,
          ehEmef: false,
          ehEmebs: true,
        },
        faixasEtarias,
        tiposAlimentacao,
        tabelas: [
          criarTabela({
            nome: "ALIMENTACOES INFANTIL",
            valores: [
              {
                nome_campo: "lanche",
                tipo_valor: "UNITARIO",
                valor: "9,50",
              },
            ],
          }),
        ],
      });

      expect(resultado).toBe(9.5);
    });

    it("deve ignorar valores que não sejam UNITARIO", () => {
      const resultado = getValorUnitario({
        desconto: {
          tipo_lancamento: "ALIMENTACOES",
          faixa_etaria: "",
          tipo_alimentacao: "uuid-lanche",
        },
        grupo: {
          ehCei: false,
          ehCemei: false,
          ehEmef: false,
          ehEmebs: false,
        },
        faixasEtarias,
        tiposAlimentacao,
        tabelas: [
          criarTabela({
            nome: "ALIMENTACOES",
            valores: [
              {
                nome_campo: "lanche",
                tipo_valor: "PERCENTUAL",
                valor: "99,00",
              },
            ],
          }),
        ],
      });

      expect(resultado).toBe(0);
    });

    it("deve retornar 0 quando não encontrar a tabela", () => {
      const resultado = getValorUnitario({
        desconto: {
          tipo_lancamento: "ALIMENTACOES",
          faixa_etaria: "",
          tipo_alimentacao: "uuid-lanche",
        },
        grupo: {
          ehCei: false,
          ehCemei: false,
          ehEmef: false,
          ehEmebs: false,
        },
        faixasEtarias,
        tiposAlimentacao,
        tabelas: [],
      });

      expect(resultado).toBe(0);
    });
  });
});
