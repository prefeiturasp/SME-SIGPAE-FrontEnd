import mock from "src/services/_mock";
import { obtemDadosAlunoPeloEOL } from "src/services/perfil.service";

describe("test perfil.service", () => {
  const eol = 123456;

  mock.onGet(`/dados-alunos-eol/${eol}/`).reply(200, { detalhes: "do aluno" });

  it("obtemDadosAlunoPeloEOL", async () => {
    const response = await obtemDadosAlunoPeloEOL(eol);
    expect(response).toEqual({
      status: 200,
      data: { detalhes: "do aluno" },
    });
  });
});
