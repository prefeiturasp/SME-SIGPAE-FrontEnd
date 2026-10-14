import {
  dataDentroDosMeses,
  diaPertenceAosMeses,
  ehFaixaEtariaHabilitada,
  ehTipoAlimentacaoBloqueado,
  filtraSelecionadosDisponiveis,
  formataValorMesReferencia,
  getGruposSelecionados,
  getIntervaloMeses,
  getMesAnoDoValor,
  getLimitesPeriodoAte,
  getLimitesPeriodoDe,
  separaMesesERecreios,
  validaPeriodoAte,
  validaPeriodoDe,
} from "../components/FormFiltro/helpers";
import { mockGetGrupoUnidadeEscolar } from "src/mocks/services/escola.service/mockGetGrupoUnidadeEscolar";

const MENSAGEM_FORA_DOS_MESES =
  "A data deve estar dentro de um mês de referência selecionado";

describe("Relatório de Alimentações Servidas - helpers", () => {
  describe("dataDentroDosMeses", () => {
    it("retorna true para datas de qualquer mês selecionado", () => {
      expect(dataDentroDosMeses("01/12/2023", ["12_2023"])).toBe(true);
      expect(dataDentroDosMeses("31/12/2023", ["12_2023"])).toBe(true);
      expect(dataDentroDosMeses("15/10/2023", ["12_2023", "10_2023"])).toBe(
        true,
      );
    });

    it("retorna false para datas fora dos meses, inválidas ou sem meses", () => {
      expect(dataDentroDosMeses("30/11/2023", ["12_2023", "10_2023"])).toBe(
        false,
      );
      expect(dataDentroDosMeses("01/12/2024", ["12_2023"])).toBe(false);
      expect(dataDentroDosMeses("data-invalida", ["12_2023"])).toBe(false);
      expect(dataDentroDosMeses("01/12/2023", [])).toBe(false);
      expect(dataDentroDosMeses("01/12/2023", undefined)).toBe(false);
    });
  });

  describe("diaPertenceAosMeses", () => {
    it("permite apenas os dias dos meses selecionados", () => {
      const meses = ["10_2023", "12_2023"];
      expect(diaPertenceAosMeses(new Date(2023, 9, 1), meses)).toBe(true);
      expect(diaPertenceAosMeses(new Date(2023, 11, 31), meses)).toBe(true);
      expect(diaPertenceAosMeses(new Date(2023, 10, 15), meses)).toBe(false);
    });
  });

  describe("getIntervaloMeses", () => {
    it("retorna null quando não há meses", () => {
      expect(getIntervaloMeses([])).toBeNull();
      expect(getIntervaloMeses(undefined)).toBeNull();
    });

    it("retorna o primeiro dia do menor mês e o último dia do maior mês", () => {
      expect(getIntervaloMeses(["12_2023", "02_2024", "10_2023"])).toEqual({
        primeiroDia: new Date(2023, 9, 1),
        ultimoDia: new Date(2024, 1, 29),
      });
    });
  });

  describe("limites do período", () => {
    it("usa o intervalo dos meses quando não há datas preenchidas", () => {
      const values = { meses: ["12_2023", "10_2023"] };
      expect(getLimitesPeriodoDe(values)).toEqual({
        minDate: new Date(2023, 9, 1),
        maxDate: new Date(2023, 11, 31),
      });
      expect(getLimitesPeriodoAte(values)).toEqual({
        minDate: new Date(2023, 9, 1),
        maxDate: new Date(2023, 11, 31),
      });
    });

    it("limita De pela data final e Até pela data inicial", () => {
      const values = {
        meses: ["12_2023", "10_2023"],
        periodo_lancamento_de: "05/10/2023",
        periodo_lancamento_ate: "20/12/2023",
      };
      expect(getLimitesPeriodoDe(values).maxDate).toEqual(
        new Date(2023, 11, 20),
      );
      expect(getLimitesPeriodoAte(values).minDate).toEqual(
        new Date(2023, 9, 5),
      );
    });

    it("não define limites sem meses selecionados", () => {
      expect(getLimitesPeriodoDe({})).toEqual({
        minDate: null,
        maxDate: null,
      });
    });
  });

  describe("validaPeriodoDe", () => {
    it("não valida quando não há data ou mês", () => {
      expect(
        validaPeriodoDe(undefined, { meses: ["12_2023"] }),
      ).toBeUndefined();
      expect(validaPeriodoDe("10/12/2023", {})).toBeUndefined();
      expect(validaPeriodoDe("10/12/2023", { meses: [] })).toBeUndefined();
    });

    it("não permite data fora dos meses de referência", () => {
      expect(validaPeriodoDe("10/11/2023", { meses: ["12_2023"] })).toBe(
        MENSAGEM_FORA_DOS_MESES,
      );
    });

    it("não permite data inicial posterior à data final", () => {
      expect(
        validaPeriodoDe("20/12/2023", {
          meses: ["12_2023"],
          periodo_lancamento_ate: "10/12/2023",
        }),
      ).toBe("A data inicial não pode ser posterior à data final");
    });

    it("aceita intervalo válido entre meses diferentes", () => {
      expect(
        validaPeriodoDe("10/10/2023", {
          meses: ["10_2023", "12_2023"],
          periodo_lancamento_ate: "10/12/2023",
        }),
      ).toBeUndefined();
    });
  });

  describe("validaPeriodoAte", () => {
    it("não permite data fora dos meses de referência", () => {
      expect(validaPeriodoAte("01/01/2024", { meses: ["12_2023"] })).toBe(
        MENSAGEM_FORA_DOS_MESES,
      );
    });

    it("não permite data final anterior à data inicial", () => {
      expect(
        validaPeriodoAte("05/12/2023", {
          meses: ["12_2023"],
          periodo_lancamento_de: "10/12/2023",
        }),
      ).toBe("A data final não pode ser anterior à data inicial");
    });

    it("aceita intervalo válido", () => {
      expect(
        validaPeriodoAte("20/12/2023", {
          meses: ["12_2023"],
          periodo_lancamento_de: "10/12/2023",
        }),
      ).toBeUndefined();
    });
  });

  describe("getGruposSelecionados", () => {
    const grupos = mockGetGrupoUnidadeEscolar.results;
    const tipoDoGrupo = (nome) =>
      grupos.find((grupo) => grupo.nome === nome).tipos_unidades[0].uuid;

    it("retorna todos os grupos aos quais pertencem os tipos selecionados", () => {
      expect(
        getGruposSelecionados(grupos, [
          "3f1aee3f-51f4-4759-aa2c-9ccf5c013c1c",
          tipoDoGrupo("Grupo 1"),
        ]).map((grupo) => grupo.nome),
      ).toEqual(["Grupo 1", "Grupo 3"]);
    });

    it("retorna lista vazia quando nenhum tipo está selecionado", () => {
      expect(getGruposSelecionados(grupos, [])).toEqual([]);
    });
  });

  describe("regras por grupo", () => {
    const grupo = (nome) => ({ nome, uuid: nome, tipos_unidades: [] });

    it("bloqueia Tipo de Alimentação somente quando todos os grupos são o Grupo 1", () => {
      expect(ehTipoAlimentacaoBloqueado([])).toBe(false);
      expect(ehTipoAlimentacaoBloqueado([grupo("Grupo 1")])).toBe(true);
      expect(
        ehTipoAlimentacaoBloqueado([grupo("Grupo 1"), grupo("Grupo 3")]),
      ).toBe(false);
    });

    it("habilita Faixa Etária quando algum grupo é o Grupo 1 ou o Grupo 2", () => {
      expect(ehFaixaEtariaHabilitada([])).toBe(false);
      expect(ehFaixaEtariaHabilitada([grupo("Grupo 3")])).toBe(false);
      expect(
        ehFaixaEtariaHabilitada([grupo("Grupo 2"), grupo("Grupo 4")]),
      ).toBe(true);
    });
  });

  describe("meses de referência com recreio nas férias", () => {
    it("monta o valor do recreio com o uuid e extrai o mês/ano", () => {
      expect(formataValorMesReferencia("01_2026")).toBe("01_2026");
      expect(formataValorMesReferencia("01_2026", "uuid-recreio")).toBe(
        "01_2026|uuid-recreio",
      );
      expect(getMesAnoDoValor("01_2026|uuid-recreio")).toBe("01_2026");
    });

    it("separa os meses regulares dos recreios, sem repetir", () => {
      expect(
        separaMesesERecreios([
          "12_2025",
          "01_2026|uuid-recreio",
          "01_2026",
          "01_2026|uuid-recreio",
        ]),
      ).toEqual({
        meses: ["12_2025", "01_2026"],
        recreios_nas_ferias: ["uuid-recreio"],
      });
    });

    it("considera o mês do recreio nas regras do período", () => {
      expect(dataDentroDosMeses("10/01/2026", ["01_2026|uuid-recreio"])).toBe(
        true,
      );
      expect(getIntervaloMeses(["01_2026|uuid-recreio", "12_2025"])).toEqual({
        primeiroDia: new Date(2025, 11, 1),
        ultimoDia: new Date(2026, 0, 31),
      });
    });
  });

  describe("filtraSelecionadosDisponiveis", () => {
    it("mantém somente os itens selecionados que continuam disponíveis", () => {
      expect(
        filtraSelecionadosDisponiveis(["a", "b", "c"], ["a", "c"]),
      ).toEqual(["a", "c"]);
      expect(filtraSelecionadosDisponiveis(undefined, ["a"])).toEqual([]);
    });
  });
});
