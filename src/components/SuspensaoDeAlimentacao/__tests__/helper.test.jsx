import { extrairTiposALimentacao } from "src/components/SuspensaoDeAlimentacao/helper";

describe("extrairTiposALimentacao", () => {
  it("retorna os uuids dos tipos de alimentação", () => {
    const tiposAlimentacao = [
      { uuid: "abc", nome: "Lanche" },
      { uuid: "def", nome: "Refeição" },
    ];

    expect(extrairTiposALimentacao(tiposAlimentacao)).toEqual(["abc", "def"]);
  });
});
