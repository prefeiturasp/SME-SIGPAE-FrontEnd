// src/utils/__tests__/exibirCheckBox.test.js
import { exibirCheckBox } from "src/components/screens/LancamentoInicial/PeriodoLancamentoMedicaoInicial/helper";

describe("exibirCheckBox", () => {
  const columnBase = {
    dia: "10",
    mes: "01",
    ano: "2026",
  };

  describe("com informacoesRecreio (intervalo)", () => {
    const info = {
      inicio: "01/01/2026",
      fim: "15/01/2026",
    };

    it("deve retornar true quando data estiver dentro do intervalo", () => {
      const column = { dia: "10", mes: "01", ano: "2026" };
      expect(exibirCheckBox(column, 1, info)).toBe(true);
    });

    it("deve retornar false quando data estiver fora do intervalo", () => {
      const column = { dia: "20", mes: "01", ano: "2026" };
      expect(exibirCheckBox(column, 1, info)).toBe(false);
    });

    it("deve retornar true quando for exatamente a data de início", () => {
      const column = { dia: "01", mes: "01", ano: "2026" };
      expect(exibirCheckBox(column, 1, info)).toBe(true);
    });

    it("deve retornar true quando for exatamente a data de fim", () => {
      const column = { dia: "15", mes: "01", ano: "2026" };
      expect(exibirCheckBox(column, 1, info)).toBe(true);
    });

    it("deve retornar false em virada de ano fora do intervalo", () => {
      const column = { dia: "29", mes: "12", ano: "2025" };
      expect(exibirCheckBox(column, 1, info)).toBe(false);
    });
  });

  describe("sem informacoesRecreio", () => {
    it("semana 1 e dia > 20 retorna false", () => {
      const column = { ...columnBase, dia: "25" };
      expect(exibirCheckBox(column, 1)).toBe(false);
    });

    it("semana 1 e dia <= 20 retorna true", () => {
      const column = { ...columnBase, dia: "15" };
      expect(exibirCheckBox(column, 1)).toBe(true);
    });

    it("semana 4/5/6 e dia < 10 retorna false", () => {
      const column = { ...columnBase, dia: "05" };
      expect(exibirCheckBox(column, 4)).toBe(false);
      expect(exibirCheckBox(column, 5)).toBe(false);
      expect(exibirCheckBox(column, 6)).toBe(false);
    });

    it("semana 4/5/6 e dia >= 10 retorna true", () => {
      const column = { ...columnBase, dia: "10" };
      expect(exibirCheckBox(column, 4)).toBe(true);
    });

    it("semana diferente retorna true", () => {
      const column = { ...columnBase, dia: "05" };
      expect(exibirCheckBox(column, 2)).toBe(true);
      expect(exibirCheckBox(column, 3)).toBe(true);
    });
  });

  describe("outros casos", () => {
    it("não deve quebrar com informacoesRecreio vazio", () => {
      expect(exibirCheckBox(columnBase, 1, {})).toBe(true);
    });

    it("não deve quebrar com valores string numéricos", () => {
      const column = { dia: "09", mes: "01", ano: "2026" };
      expect(exibirCheckBox(column, "4")).toBe(false);
    });
    it("deve cair no fallback quando inicio existe mas fim não", () => {
      const info = { inicio: "01/01/2026" };
      expect(exibirCheckBox(columnBase, 1, info)).toBe(true);
    });

    it("deve cair no fallback quando fim existe mas inicio não", () => {
      const info = { fim: "15/01/2026" };
      expect(exibirCheckBox(columnBase, 1, info)).toBe(true);
    });

    it("deve lidar com data inválida", () => {
      const info = { inicio: "invalid", fim: "15/01/2026" };
      expect(() => exibirCheckBox(columnBase, 1, info)).not.toThrow();
    });

    it("dia 20 na semana 1 retorna true", () => {
      const col = { ...columnBase, dia: "20" };
      expect(exibirCheckBox(col, 1)).toBe(true);
    });

    it("dia 10 na semana 4 retorna true", () => {
      const col = { ...columnBase, dia: "10" };
      expect(exibirCheckBox(col, 4)).toBe(true);
    });

    it("semana null não quebra", () => {
      expect(() => exibirCheckBox(columnBase, null)).not.toThrow();
    });

    it("column inválido não quebra", () => {
      expect(() => exibirCheckBox({}, 1)).not.toThrow();
    });

    it("intervalo invertido deve retornar false", () => {
      const column = { dia: "10", mes: "01", ano: "2026" };
      const info = { inicio: "15/01/2026", fim: "01/01/2026" };

      expect(exibirCheckBox(column, 1, info)).toBe(false);
    });
    it("intervalo de um único dia", () => {
      const column = { dia: "10", mes: "01", ano: "2026" };
      const info = { inicio: "10/01/2026", fim: "10/01/2026" };

      expect(exibirCheckBox(column, 1, info)).toBe(true);
    });
    it("deve aceitar dia sem zero à esquerda", () => {
      const column = { dia: "1", mes: "1", ano: "2026" };
      const info = { inicio: "01/01/2026", fim: "05/01/2026" };

      expect(exibirCheckBox(column, 1, info)).toBe(true);
    });

    it("não deve falhar por timezone", () => {
      const column = { dia: "01", mes: "01", ano: "2026" };
      const info = { inicio: "01/01/2026", fim: "01/01/2026" };

      expect(exibirCheckBox(column, 1, info)).toBe(true);
    });

    it("dados inválidos devem retornar false", () => {
      const column = { dia: "32", mes: "13", ano: "2026" };
      const info = { inicio: "01/01/2026", fim: "31/12/2026" };

      expect(exibirCheckBox(column, 1, info)).toBe(false);
    });

    it("deve funcionar com números ao invés de string", () => {
      const column = { dia: 10, mes: 1, ano: 2026 };
      const info = { inicio: "01/01/2026", fim: "15/01/2026" };

      expect(exibirCheckBox(column, 1, info)).toBe(true);
    });
    it("semana inválida deve cair no default", () => {
      const column = { dia: "05", mes: "01", ano: "2026" };
      expect(exibirCheckBox(column, 99)).toBe(true);
    });
    it("não deve confundir mês ao comparar intervalo", () => {
      const column = { dia: "10", mes: "02", ano: "2026" };
      const info = { inicio: "01/01/2026", fim: "31/01/2026" };

      expect(exibirCheckBox(column, 1, info)).toBe(false);
    });
    it("dia inválido deve retornar false no intervalo", () => {
      const column = { dia: undefined, mes: "01", ano: "2026" };
      const info = { inicio: "01/01/2026", fim: "15/01/2026" };

      expect(exibirCheckBox(column, 1, info)).toBe(false);
    });
    it("intervalo deve sobrescrever regra de semana", () => {
      const column = { dia: "25", mes: "01", ano: "2026" };
      const info = { inicio: "01/01/2026", fim: "31/01/2026" };

      expect(exibirCheckBox(column, 1, info)).toBe(true);
    });
    it("intervalo que cruza meses deve funcionar", () => {
      const column = { dia: "05", mes: "02", ano: "2026" };
      const info = { inicio: "25/01/2026", fim: "10/02/2026" };

      expect(exibirCheckBox(column, 1, info)).toBe(true);
    });
    it("intervalo cruzando ano deve funcionar", () => {
      const column = { dia: "02", mes: "01", ano: "2026" };
      const info = { inicio: "20/12/2025", fim: "10/01/2026" };

      expect(exibirCheckBox(column, 1, info)).toBe(true);
    });
  });
});
