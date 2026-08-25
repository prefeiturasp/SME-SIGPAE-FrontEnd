import { validaQuantidadeFaixaCEI } from "../helpers";

const valida = (value, faixas) =>
  validaQuantidadeFaixaCEI({ periodoIndice: 0, max: 69 })(value, {
    substituicoes: [{ cei: { faixas_etarias: faixas } }],
  });

describe("Teste funções do helper - Alteração de Cardápio CEMEI", () => {
  it("Deve retornar erro quando nenhuma faixa etária está preenchida", () => {
    expect(
      valida("", [{ quantidade_alunos: "" }, { quantidade_alunos: "" }]),
    ).toBe("Campo obrigatório");
  });

  it("Deve permitir faixa vazia quando ao menos uma faixa está preenchida", () => {
    expect(
      valida("", [{ quantidade_alunos: "10" }, { quantidade_alunos: "" }]),
    ).toBeUndefined();
  });

  it("Deve retornar erro quando o valor é zero", () => {
    expect(valida("0", [{ quantidade_alunos: "" }])).toBe(
      "Deve ser ao menos 1",
    );
  });

  it("Deve retornar erro quando o valor é maior que o máximo", () => {
    expect(valida("70", [{ quantidade_alunos: "" }])).toBe(
      "Não pode ser maior que 69",
    );
  });

  it("Deve retornar undefined quando o valor é válido", () => {
    expect(valida("30", [{ quantidade_alunos: "30" }])).toBeUndefined();
  });
});
