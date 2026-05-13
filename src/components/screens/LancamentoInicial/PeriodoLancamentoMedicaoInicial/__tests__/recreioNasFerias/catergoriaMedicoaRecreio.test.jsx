import { trataCategoriasMedicaoRecreio } from "src/components/screens/LancamentoInicial/PeriodoLancamentoMedicaoInicial/helper";

const mockResponseCategoriasMedicao = [
  {
    id: 1,
    nome: "ALIMENTAÇÃO",
    ativo: true,
    uuid: "1",
  },
  {
    id: 2,
    nome: "DIETA ESPECIAL - TIPO A",
    ativo: true,
    uuid: "2",
  },
  {
    id: 3,
    nome: "DIETA ESPECIAL - TIPO A - ENTERAL / RESTRIÇÃO DE AMINOÁCIDOS",
    ativo: true,
    uuid: "3",
  },
  {
    id: 4,
    nome: "DIETA ESPECIAL - TIPO B",
    ativo: true,
    uuid: "4",
  },
];

const createTiposAlimentacao = (names = []) =>
  names.map((name) => ({
    nome: name,
    name,
    uuid: null,
  }));

describe("trataCategoriasMedicaoRecreio", () => {
  describe("Quando NÃO há lanche nem refeição", () => {
    it("deve remover TODAS as categorias ENTERAL e DIETA ESPECIAL", () => {
      const result = trataCategoriasMedicaoRecreio(
        mockResponseCategoriasMedicao,
        createTiposAlimentacao([]),
      );

      expect(result).toEqual([
        mockResponseCategoriasMedicao[0], // Apenas ALIMENTAÇÃO
      ]);
    });

    it("deve ignorar tipos irrelevantes como participantes, frequência e observações", () => {
      const result = trataCategoriasMedicaoRecreio(
        mockResponseCategoriasMedicao,
        createTiposAlimentacao(["participantes", "frequencia", "observacoes"]),
      );

      expect(result).toEqual([
        mockResponseCategoriasMedicao[0], // Apenas ALIMENTAÇÃO
      ]);
    });
  });

  describe("Quando possui APENAS refeição (sem lanche)", () => {
    it("deve manter categorias ENTERAL mas remover outras DIETA ESPECIAL", () => {
      const result = trataCategoriasMedicaoRecreio(
        mockResponseCategoriasMedicao,
        createTiposAlimentacao(["refeicao"]),
      );

      expect(result).toEqual([
        mockResponseCategoriasMedicao[0], // ALIMENTAÇÃO
        mockResponseCategoriasMedicao[2], // DIETA ESPECIAL - ENTERAL
      ]);
    });

    it('deve manter especificamente categorias que contém "ENTERAL" no nome', () => {
      const result = trataCategoriasMedicaoRecreio(
        mockResponseCategoriasMedicao,
        createTiposAlimentacao(["refeicao"]),
      );

      const nomes = result.map((item) => item.nome);

      expect(nomes).toContain(
        "DIETA ESPECIAL - TIPO A - ENTERAL / RESTRIÇÃO DE AMINOÁCIDOS",
      );
      expect(nomes).not.toContain("DIETA ESPECIAL - TIPO A");
      expect(nomes).not.toContain("DIETA ESPECIAL - TIPO B");
    });

    it("deve remover DIETA ESPECIAL não ENTERAL mesmo com nomes variados", () => {
      const categorias = [
        { id: 1, nome: "ALIMENTAÇÃO" },
        { id: 2, nome: "DIETA ESPECIAL - TIPO A" },
        { id: 3, nome: "ENTERAL" },
      ];

      const result = trataCategoriasMedicaoRecreio(
        categorias,
        createTiposAlimentacao(["refeicao"]),
      );

      expect(result).toEqual([
        categorias[0], // ALIMENTAÇÃO
        categorias[2], // ENTERAL
      ]);
    });
  });

  describe("Quando possui lanche/lanche_4h (independente de refeição)", () => {
    it('deve manter TODAS as categorias quando há apenas "lanche"', () => {
      const result = trataCategoriasMedicaoRecreio(
        mockResponseCategoriasMedicao,
        createTiposAlimentacao(["lanche"]),
      );

      expect(result).toEqual(mockResponseCategoriasMedicao);
    });

    it('deve manter TODAS as categorias quando há apenas "lanche_4h"', () => {
      const result = trataCategoriasMedicaoRecreio(
        mockResponseCategoriasMedicao,
        createTiposAlimentacao(["lanche_4h"]),
      );

      expect(result).toEqual(mockResponseCategoriasMedicao);
    });

    it('deve manter TODAS as categorias quando há "lanche" e "refeição"', () => {
      const result = trataCategoriasMedicaoRecreio(
        mockResponseCategoriasMedicao,
        createTiposAlimentacao(["lanche", "refeicao"]),
      );

      expect(result).toEqual(mockResponseCategoriasMedicao);
    });

    it('deve manter TODAS as categorias quando há "lanche_4h" e "refeição"', () => {
      const result = trataCategoriasMedicaoRecreio(
        mockResponseCategoriasMedicao,
        createTiposAlimentacao(["lanche_4h", "refeicao"]),
      );

      expect(result).toEqual(mockResponseCategoriasMedicao);
    });

    it("deve manter TODAS as categorias quando há ambos os tipos de lanche", () => {
      const result = trataCategoriasMedicaoRecreio(
        mockResponseCategoriasMedicao,
        createTiposAlimentacao(["lanche", "lanche_4h"]),
      );

      expect(result).toEqual(mockResponseCategoriasMedicao);
    });
  });

  describe("Casos de borda", () => {
    it("deve retornar array vazio quando não há categorias de entrada", () => {
      const result = trataCategoriasMedicaoRecreio(
        [],
        createTiposAlimentacao(["lanche"]),
      );

      expect(result).toEqual([]);
    });

    it("deve retornar array vazio quando categorias são removidas e array fica vazio", () => {
      const categorias = [{ id: 1, nome: "DIETA ESPECIAL - TIPO A" }];

      const result = trataCategoriasMedicaoRecreio(
        categorias,
        createTiposAlimentacao([]),
      );

      expect(result).toEqual([]);
    });

    it("não deve modificar o array original (imutabilidade)", () => {
      const categoriasOriginais = [...mockResponseCategoriasMedicao];

      trataCategoriasMedicaoRecreio(
        mockResponseCategoriasMedicao,
        createTiposAlimentacao([]),
      );

      expect(mockResponseCategoriasMedicao).toEqual(categoriasOriginais);
    });
  });
});
