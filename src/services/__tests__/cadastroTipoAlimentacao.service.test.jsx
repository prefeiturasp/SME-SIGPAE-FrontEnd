import {
  alteraVinculosTipoAlimentacao,
  atualizaQuantidadeDeAlunos,
  putHorariosCombosPorEscola,
  updateVinculosTipoAlimentacaoPorTipoUnidadeEscolar,
} from "../cadastroTipoAlimentacao.service";

describe("cadastroTipoAlimentacao.service", () => {
  let fetchOriginal;

  beforeEach(() => {
    fetchOriginal = global.fetch;
    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch = fetchOriginal;
  });

  const mockFetchComResposta = (corpo, status = 200) => {
    global.fetch.mockResolvedValue({
      status,
      json: () => Promise.resolve(corpo),
    });
  };

  it("updateVinculosTipoAlimentacaoPorTipoUnidadeEscolar retorna o json com o status", async () => {
    mockFetchComResposta({ uuid: "123", ativo: true }, 200);

    const resposta = await updateVinculosTipoAlimentacaoPorTipoUnidadeEscolar({
      uuid: "123",
      ativo: true,
    });

    expect(resposta.status).toEqual(200);
    expect(resposta.uuid).toEqual("123");
    expect(resposta.ativo).toEqual(true);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("alteraVinculosTipoAlimentacao retorna o json com o status", async () => {
    mockFetchComResposta({ uuid: "456" }, 200);

    const resposta = await alteraVinculosTipoAlimentacao("456", {
      ativo: false,
    });

    expect(resposta.status).toEqual(200);
    expect(resposta.uuid).toEqual("456");
  });

  it("putHorariosCombosPorEscola retorna o json com o status", async () => {
    mockFetchComResposta({ uuid: "789" }, 200);

    const resposta = await putHorariosCombosPorEscola(
      { horario: "10:00" },
      "789",
    );

    expect(resposta.status).toEqual(200);
    expect(resposta.uuid).toEqual("789");
  });

  it("atualizaQuantidadeDeAlunos retorna o json com o status mesmo em erro", async () => {
    mockFetchComResposta({ detail: "erro" }, 400);

    const resposta = await atualizaQuantidadeDeAlunos(
      { quantidade: 10 },
      "321",
    );

    expect(resposta.status).toEqual(400);
    expect(resposta.detail).toEqual("erro");
  });
});
