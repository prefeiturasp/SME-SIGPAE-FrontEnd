import { loteEstaCompleto, montarPayload, quantidadeValida } from "../helpers";

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

  it("monta o payload removendo espaços e convertendo a quantidade", () => {
    const payload = montarPayload({
      categoria: "NAO_PERECIVEIS",
      produto: "  Arroz  ",
      tipo_ocorrencia: "RECLAMACAO_QUALIDADE",
      lotes: [
        {
          lote: "  L1 ",
          marca: " Marca A ",
          data_fabricacao: "01/01/2026",
          data_validade: "01/01/2027",
          quantidade_problema_devolucao: "1.234,50",
        },
      ],
    });

    expect(payload).toEqual({
      categoria: "NAO_PERECIVEIS",
      produto: "Arroz",
      tipo_ocorrencia: "RECLAMACAO_QUALIDADE",
      lotes: [
        {
          lote: "L1",
          marca: "Marca A",
          data_fabricacao: "01/01/2026",
          data_validade: "01/01/2027",
          quantidade_problema_devolucao: "1234.50",
        },
      ],
    });
  });
});
