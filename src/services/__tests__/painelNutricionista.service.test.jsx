import fetchMock from "fetch-mock";

import { SOLICITACOES, SOLICITACOES_DIETA } from "../constants";
import { API_URL } from "../../constants/config";
import {
  getMotivosNegacaoDietaEspecial,
  getSolicitacoesPendentesNutricionista,
  getSolicitacoesAutorizadasNutricionista,
  getSolicitacoesNegadasNutricionista,
  getTiposDietaEspecial,
} from "../painelNutricionista.service";
import { getAlergiasIntolerancias } from "../dietaEspecial.service";

fetchMock.get(`${SOLICITACOES_DIETA}/${SOLICITACOES.PENDENTES}/`, {
  results: ["resultados", "pendentes"],
});
fetchMock.get(`${SOLICITACOES_DIETA}/${SOLICITACOES.AUTORIZADOS}/`, {
  results: ["resultados", "autorizados"],
});
fetchMock.get(`${SOLICITACOES_DIETA}/${SOLICITACOES.NEGADOS}/`, {
  results: ["resultados", "negados"],
});
fetchMock.get(`${API_URL}/alergias-intolerancias/`, {
  results: [
    { descricao: "asdf", id: "1234" },
    { descricao: "qwer", id: "5678" },
  ],
});
fetchMock.get(`${API_URL}/tipos-dieta-especial/`, {
  results: ["tipos", "dieta", "especial"],
});
fetchMock.get(`${API_URL}/motivos-negacao/?processo=INCLUSAO`, {
  results: ["motivos", "negacao"],
});
fetchMock.get(`begin:${SOLICITACOES_DIETA}/`, { resultado: "dieta-especial" });

describe("test painelNutricionista.service", () => {
  it("getSolicitacoesPendentesNutricionista", async () => {
    const response = await getSolicitacoesPendentesNutricionista();
    expect(response).toEqual({
      results: ["resultados", "pendentes"],
      status: 200,
    });
  });
  it("getSolicitacoesPendentesNutricionista", async () => {
    const response = await getSolicitacoesAutorizadasNutricionista();
    expect(response).toEqual({
      results: ["resultados", "autorizados"],
      status: 200,
    });
  });
  it("getSolicitacoesPendentesNutricionista", async () => {
    const response = await getSolicitacoesNegadasNutricionista();
    expect(response).toEqual({
      results: ["resultados", "negados"],
      status: 200,
    });
  });
  it("getAlergiasIntolerancias", async () => {
    const response = await getAlergiasIntolerancias();
    expect(response).toEqual({
      results: [
        { nome: "asdf", uuid: "1234" },
        { nome: "qwer", uuid: "5678" },
      ],
      status: 200,
    });
  });
  it("getTiposDietaEspecial", async () => {
    const response = await getTiposDietaEspecial();
    expect(response).toEqual({
      results: ["tipos", "dieta", "especial"],
      status: 200,
    });
  });
  it("getMotivosNegacaoDietaEspecial", async () => {
    const response = await getMotivosNegacaoDietaEspecial();
    expect(response).toEqual({
      results: ["motivos", "negacao"],
      status: 200,
    });
  });
});
