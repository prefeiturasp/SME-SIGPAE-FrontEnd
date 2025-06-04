import { validaForm } from "../../CEI/helper";

describe("Teste funções do helper - Alteracao Cardápio CEI", () => {
  it("Deve retornar erro `É necessário selecionar pelo menos um período`", () => {
    const values = {
      substituicoes: [
        {
          nome: "INTEGRAL",
          posicao: 1,
          possui_alunos_regulares: true,
          tipo_turno: 1,
        },
      ],
    };
    expect(validaForm(values)).toBe(
      "É necessário selecionar pelo menos um período"
    );
  });

  it("Deve retornar erro `Ao selecionar um período, é necessário preencher ao menos uma faixa etária`", () => {
    const values = {
      substituicoes: [
        {
          checked: true,
          nome: "INTEGRAL",
          posicao: 1,
          possui_alunos_regulares: true,
          tipo_turno: 1,
        },
      ],
    };
    expect(validaForm(values)).toBe(
      "Ao selecionar um período, é necessário preencher ao menos uma faixa etária"
    );
  });
});
