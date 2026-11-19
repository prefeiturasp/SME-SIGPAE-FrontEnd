import {
  indicesLotesDuplicados,
  loteEstaCompleto,
  montarPayload,
  padronizarTextoMaiusculoSemAcento,
  quantidadeValida,
} from "../helpers";

describe("helpers do Memorando de Ocorrências", () => {
  it("considera a quantidade zero como preenchida", () => {
    expect(quantidadeValida("0")).toBeUndefined();
  });

  it("rejeita quantidade vazia, negativa ou não numérica", () => {
    expect(quantidadeValida("")).toBe("Campo obrigatório");
    expect(quantidadeValida("-1")).toBe(
      "Informe um valor maior ou igual a zero",
    );
    expect(quantidadeValida("abc")).toBe("Informe um número válido");
    expect(quantidadeValida("...")).toBe("Informe um número válido");
    expect(quantidadeValida("1,2,3")).toBe("Informe um número válido");
  });

  it("aceita quantidades no formato brasileiro", () => {
    expect(quantidadeValida("10")).toBeUndefined();
    expect(quantidadeValida("10,5")).toBeUndefined();
    expect(quantidadeValida("1.234")).toBeUndefined();
    expect(quantidadeValida("1.234,56")).toBeUndefined();
  });

  it("identifica lote completo somente com todos os campos preenchidos", () => {
    const lote = {
      lote: "L1",
      marca: "Marca A",
      data_fabricacao: "01/01/2026",
      data_validade: "01/01/2027",
      quantidade_problema_devolucao: "0",
    };

    expect(loteEstaCompleto(lote)).toBe(true);
    expect(loteEstaCompleto({ ...lote, marca: "" })).toBe(false);
    expect(loteEstaCompleto({ ...lote, data_validade: "" })).toBe(false);
    expect(loteEstaCompleto()).toBe(false);
  });

  it("monta o payload com unidade de medida no topo, tipo_ocorrencia fixo e campos sem espaços", () => {
    const payload = montarPayload({
      categoria: "NAO_PERECIVEIS",
      produto: "  ARROZ  ",
      unidade_medida: "uuid-kg",
      lotes: [
        {
          lote: "  L1 ",
          marca: " MARCA A ",
          data_fabricacao: "01/01/2026",
          data_validade: "01/01/2027",
          quantidade_problema_devolucao: "1.234,50",
        },
      ],
    });

    expect(payload).toEqual({
      categoria: "NAO_PERECIVEIS",
      produto: "ARROZ",
      tipo_ocorrencia: "RECLAMACAO_QUALIDADE",
      unidade_medida: "uuid-kg",
      lotes: [
        {
          lote: "L1",
          marca: "MARCA A",
          data_fabricacao: "01/01/2026",
          data_validade: "01/01/2027",
          quantidade_problema_devolucao: "1234.50",
        },
      ],
    });
  });

  describe("valida a padronização dos textos de produto e marca", () => {
    it.each([
      ["Arroz branco tipo 1", "ARROZ BRANCO TIPO 1"],
      ["Açúcar cristal", "ACUCAR CRISTAL"],
      ["Tio João", "TIO JOAO"],
      ["São José", "SAO JOSE"],
      ["Couve-flor", "COUVE FLOR"],
      ["Arroz@123!", "ARROZ123"],
    ])("converte %s para %s", (entrada, saida) => {
      expect(padronizarTextoMaiusculoSemAcento(entrada)).toBe(saida);
    });
  });

  describe("verifica o helper indicesLotesDuplicados", () => {
    const base = {
      lote: "Lote 1",
      marca: "MARCA",
      data_fabricacao: "01/01/2026",
      data_validade: "01/01/2027",
    };

    it("retorna vazio quando não há duplicatas", () => {
      const set = indicesLotesDuplicados([base, { ...base, lote: "Lote 2" }]);
      expect(set.size).toBe(0);
    });

    it("sinaliza apenas as ocorrências após a primeira", () => {
      const set = indicesLotesDuplicados([base, { ...base }, { ...base }]);
      expect(Array.from(set)).toEqual([1, 2]);
    });

    it("ignora lotes com algum campo em branco", () => {
      const set = indicesLotesDuplicados([base, { ...base, marca: "" }]);
      expect(set.size).toBe(0);
    });
  });
});
