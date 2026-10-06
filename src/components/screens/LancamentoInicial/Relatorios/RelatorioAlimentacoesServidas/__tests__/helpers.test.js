import {
  dataDentroDoMes,
  filtraSelecionadosDisponiveis,
  getGrupoSelecionado,
  validaPeriodoAte,
  validaPeriodoDe,
} from "../components/FormFiltro/helpers";
import { mockGetGrupoUnidadeEscolar } from "src/mocks/services/escola.service/mockGetGrupoUnidadeEscolar";

describe("Relatório de Alimentações Servidas - helpers", () => {
  describe("dataDentroDoMes", () => {
    it("retorna true para datas do mês de referência", () => {
      expect(dataDentroDoMes("01/12/2023", "12_2023")).toBe(true);
      expect(dataDentroDoMes("31/12/2023", "12_2023")).toBe(true);
    });

    it("retorna false para datas fora do mês de referência ou inválidas", () => {
      expect(dataDentroDoMes("30/11/2023", "12_2023")).toBe(false);
      expect(dataDentroDoMes("01/12/2024", "12_2023")).toBe(false);
      expect(dataDentroDoMes("data-invalida", "12_2023")).toBe(false);
    });
  });

  describe("validaPeriodoDe", () => {
    it("não valida quando não há data ou mês", () => {
      expect(validaPeriodoDe(undefined, { mes: "12_2023" })).toBeUndefined();
      expect(validaPeriodoDe("10/12/2023", {})).toBeUndefined();
    });

    it("não permite data fora do mês de referência", () => {
      expect(validaPeriodoDe("10/11/2023", { mes: "12_2023" })).toBe(
        "A data deve estar dentro do mês de referência",
      );
    });

    it("não permite data inicial posterior à data final", () => {
      expect(
        validaPeriodoDe("20/12/2023", {
          mes: "12_2023",
          periodo_lancamento_ate: "10/12/2023",
        }),
      ).toBe("A data inicial não pode ser posterior à data final");
    });

    it("aceita intervalo válido", () => {
      expect(
        validaPeriodoDe("10/12/2023", {
          mes: "12_2023",
          periodo_lancamento_ate: "10/12/2023",
        }),
      ).toBeUndefined();
    });
  });

  describe("validaPeriodoAte", () => {
    it("não permite data fora do mês de referência", () => {
      expect(validaPeriodoAte("01/01/2024", { mes: "12_2023" })).toBe(
        "A data deve estar dentro do mês de referência",
      );
    });

    it("não permite data final anterior à data inicial", () => {
      expect(
        validaPeriodoAte("05/12/2023", {
          mes: "12_2023",
          periodo_lancamento_de: "10/12/2023",
        }),
      ).toBe("A data final não pode ser anterior à data inicial");
    });

    it("aceita intervalo válido", () => {
      expect(
        validaPeriodoAte("20/12/2023", {
          mes: "12_2023",
          periodo_lancamento_de: "10/12/2023",
        }),
      ).toBeUndefined();
    });
  });

  describe("getGrupoSelecionado", () => {
    it("retorna o grupo ao qual pertencem os tipos de unidade selecionados", () => {
      const grupo = getGrupoSelecionado(mockGetGrupoUnidadeEscolar.results, [
        "3f1aee3f-51f4-4759-aa2c-9ccf5c013c1c",
      ]);
      expect(grupo.nome).toBe("Grupo 3");
    });

    it("retorna undefined quando nenhum tipo está selecionado", () => {
      expect(
        getGrupoSelecionado(mockGetGrupoUnidadeEscolar.results, []),
      ).toBeUndefined();
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
