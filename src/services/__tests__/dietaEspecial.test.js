import mock from "../_mock";

import { API_URL } from "../../constants/config";
import { ENDPOINT } from "../../constants/shared";
import { SOLICITACOES_DIETA } from "../constants";

import {
  CODAEAutorizaDietaEspecial,
  CODAENegaDietaEspecial,
  getAlimentos,
  getDietasAtivasInativasPorAluno,
  getSolicitacaoDietaEspecial,
  terceirizadaTomaCienciaDietaEspecial,
} from "../dietaEspecial.service";

describe("test getDietasAtivasInativasPorAluno", () => {
  const baseUrl = `${API_URL}/solicitacoes-dieta-especial-ativas-inativas/`;
  mock.onGet(baseUrl).reply(200, ["dietas", "inativas"]);
  mock.onGet(baseUrl + "?dre=12").reply(200, ["dietas", "inativas"]);
  test("sem parâmetros", async () => {
    const response = await getDietasAtivasInativasPorAluno();
    expect(response.data).toEqual(["dietas", "inativas"]);
    expect(response.status).toEqual(200);
  });
  test("pesquisa dre", async () => {
    const response = await getDietasAtivasInativasPorAluno({
      dre: 12,
    });
    expect(response.data).toEqual(["dietas", "inativas"]);
    expect(response.status).toEqual(200);
  });
});

describe("test getAlimentos", () => {
  const baseUrl = `${API_URL}/${ENDPOINT.ALIMENTOS}/`;
  mock.onGet(baseUrl).reply(200, ["lista", "de", "alimentos"]);
  test("obtem lista de alimentos", async () => {
    const response = await getAlimentos();
    expect(response.data).toEqual(["lista", "de", "alimentos"]);
    expect(response.status).toEqual(200);
  });
});

describe("test CODAEAutorizaDietaEspecial", () => {
  const uuid = "1234-5678";
  const baseUrl = `${API_URL}/${ENDPOINT.AUTORIZAR_DIETA(uuid)}/`;
  mock.onPatch(baseUrl).reply(200, {
    detail: "Autorização de Dieta Especial realizada com sucesso",
  });
  test("autorização bem sucedida", async () => {
    const response = await CODAEAutorizaDietaEspecial(uuid, {});
    expect(response.data).toEqual({
      detail: "Autorização de Dieta Especial realizada com sucesso",
    });
    expect(response.status).toEqual(200);
  });
});

describe("test getSolicitacaoDietaEspecial", () => {
  const uuid = "asdf-1234-qwer";
  const baseUrl = `${SOLICITACOES_DIETA}/${uuid}/`;
  mock.onGet(baseUrl).reply(200, { resultado: "dieta-especial" });
  test("obtém dados corretamente", async () => {
    const response = await getSolicitacaoDietaEspecial(uuid);
    expect(response.data).toEqual({ resultado: "dieta-especial" });
    expect(response.status).toEqual(200);
  });
});

describe("test terceirizadaTomaCienciaDietaEspecial", () => {
  const uuid = "asdf-1234-qwer";
  const baseUrl = `${API_URL}/solicitacoes-dieta-especial/${uuid}/tomar_ciencia/`;
  mock
    .onPost(baseUrl)
    .reply(200, { mensagem: "Ciente da solicitação de dieta especial" });
  test("obtém dados corretamente", async () => {
    const response = await terceirizadaTomaCienciaDietaEspecial(uuid);
    expect(response.data).toEqual({
      mensagem: "Ciente da solicitação de dieta especial",
    });
    expect(response.status).toEqual(200);
  });
});

describe("test CODAENegaDietaEspecial", () => {
  const uuid = "asdf-1234-qwer";
  const baseUrl = `${API_URL}/solicitacoes-dieta-especial/${uuid}/negar/`;
  mock
    .onPost(baseUrl)
    .reply(200, { mensagem: "Solicitação de Dieta Especial Negada" });
  test("obtém dados corretamente", async () => {
    const response = await CODAENegaDietaEspecial(uuid);
    expect(response.data).toEqual({
      mensagem: "Solicitação de Dieta Especial Negada",
    });
    expect(response.status).toEqual(200);
  });
});
