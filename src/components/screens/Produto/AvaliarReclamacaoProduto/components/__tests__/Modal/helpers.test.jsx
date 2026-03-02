import { getMensagemSucesso } from "src/components/screens/Produto/AvaliarReclamacaoProduto/components/Modal/helpers";

describe("getMensagemSucesso", () => {
  it.each([
    [
      "Questionar terceirizada",
      "Questionamento da terceirizada realizado com sucesso",
    ],
    ["Recusar reclamação", "Reclamação recusada com sucesso"],
    ["Aceitar reclamação", "Reclamação aceita com sucesso"],
    ["qualquer outro valor", "Operação realizada com sucesso"],
    [undefined, "Operação realizada com sucesso"],
  ])("dado '%s' deve retornar '%s'", (input, expected) => {
    expect(getMensagemSucesso(input)).toBe(expected);
  });
});
