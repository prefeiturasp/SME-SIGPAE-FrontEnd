import mock from "src/services/_mock";
import { getAlergiasIntolerancias } from "../dietaEspecial.service";
import { getMotivosNegacaoDietaEspecial } from "../painelNutricionista.service";

describe("test painelNutricionista.service", () => {
  it("getAlergiasIntolerancias", async () => {
    mock.onGet("/alergias-intolerancias/").reply(200, {
      results: [
        { descricao: "asdf", id: "1234" },
        { descricao: "qwer", id: "5678" },
      ],
    });

    const response = await getAlergiasIntolerancias();
    expect(response).toEqual({
      data: {
        results: [
          { descricao: "asdf", id: "1234" },
          { descricao: "qwer", id: "5678" },
        ],
      },
      status: 200,
    });
  });

  it("getMotivosNegacaoDietaEspecial", async () => {
    mock.onGet("/motivos-negacao/?processo=INCLUSAO/").reply(200, {
      results: ["motivos", "negacao"],
    });

    const response = await getMotivosNegacaoDietaEspecial();
    expect(response).toEqual({
      data: {
        results: ["motivos", "negacao"],
      },
      status: 200,
    });
  });
});
