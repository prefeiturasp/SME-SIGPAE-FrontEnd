import mock from "../_mock";

import { API_URL } from "../../constants/config";
import { ENDPOINT } from "../../constants/shared";

import { criarFaixasEtarias, getFaixasEtarias } from "../faixaEtaria.service";

describe("faixaEtaria.service.test", () => {
  const faixas = [
    { inicio: 2, fim: 5 },
    { inicio: 7, fim: 10 },
    { inicio: 12, fim: 17 },
  ];
  const justificativa = "Primeira carga";
  const baseUrl = `${API_URL}/${ENDPOINT.FAIXAS_ETARIAS}/`;
  mock.onGet(baseUrl).reply(200, {
    count: faixas.length,
    results: faixas,
  });
  mock.onPost(baseUrl).reply(201);

  beforeEach(() => {
    mock.resetHistory();
  });

  test("test criarFaixasEtarias", async () => {
    const response = await criarFaixasEtarias(faixas, justificativa);
    expect(response.status).toEqual(201);
    const request = mock.history.post[0];
    expect(JSON.parse(request.data)).toEqual({
      faixas_etarias_ativadas: faixas,
      justificativa,
    });
  });

  test("test getFaixasEtarias", async () => {
    const response = await getFaixasEtarias(faixas);
    expect(response.status).toEqual(200);
    expect(response.data.count).toEqual(3);
    expect(response.data.results).toEqual(faixas);
  });
});
