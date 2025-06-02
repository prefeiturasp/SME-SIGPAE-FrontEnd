import fetchMock from "fetch-mock";

import { API_URL } from "../../constants/config";
import { obtemDadosAlunoPeloEOL } from "../perfil.service";

fetchMock.get(`${API_URL}/dados-alunos-eol/123456/`, {
  detail: { detalhes: "do aluno" },
});

describe("test perfil.service", () => {
  it("obtemDadosAlunoPeloEOL", async () => {
    const response = await obtemDadosAlunoPeloEOL(123456);
    expect(response).toEqual({
      detail: { detalhes: "do aluno" },
      status: 200,
    });
  });
});
