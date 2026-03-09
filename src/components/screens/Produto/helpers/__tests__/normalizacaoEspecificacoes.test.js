import {
  normalizarEspecificacoes,
  normalizarVolume,
} from "../normalizacaoEspecificacoes";

describe("normalizacaoEspecificacoes", () => {
  describe("normalizarVolume", () => {
    it("deve converter decimal com virgula para numero com ponto", () => {
      expect(normalizarVolume("1,5")).toBe(1.5);
    });

    it("deve converter formato com milhar e virgula decimal", () => {
      expect(normalizarVolume("1.234,56")).toBe(1234.56);
    });

    it("deve manter numero quando valor ja for number", () => {
      expect(normalizarVolume(2.75)).toBe(2.75);
    });

    it("deve manter valor original quando for invalido", () => {
      expect(normalizarVolume("abc")).toBe("abc");
    });
  });

  describe("normalizarEspecificacoes", () => {
    it("deve normalizar volume de cada especificacao", () => {
      const especificacoes = [
        { volume: "2,5", unidade_de_medida: "u1", embalagem_produto: "e1" },
        { volume: "3", unidade_de_medida: "u2", embalagem_produto: "e2" },
      ];

      expect(normalizarEspecificacoes(especificacoes)).toEqual([
        { volume: 2.5, unidade_de_medida: "u1", embalagem_produto: "e1" },
        { volume: 3, unidade_de_medida: "u2", embalagem_produto: "e2" },
      ]);
    });
  });
});
