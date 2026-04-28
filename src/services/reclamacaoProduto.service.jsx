import axios from "./_base";
import { API_URL } from "../constants/config";
import authService from "./auth";
import { ErrorHandlerFunction } from "./service-helpers";

const authToken = {
  Authorization: `JWT ${authService.getToken()}`,
  "Content-Type": "application/json",
};

export const CODAEAceitaReclamacao = async (uuid, params) =>
  await axios.patch(`/reclamacoes-produtos/${uuid}/codae-aceita/`, params);

export const CODAERecusaReclamacao = async (uuid, params) =>
  await axios.patch(`/reclamacoes-produtos/${uuid}/codae-recusa/`, params);

export const CODAEQuestionaTerceirizada = async (uuid, params) =>
  await axios.patch(
    `/reclamacoes-produtos/${uuid}/codae-questiona-terceirizada/`,
    params,
  );

export const CODAEQuestionaUE = async (uuid, params) =>
  await axios.patch(
    `/reclamacoes-produtos/${uuid}/codae-questiona-ue/`,
    params,
  );

export const CODAEQuestionaNutrisupervisor = async (uuid, params) =>
  await axios.patch(
    `/reclamacoes-produtos/${uuid}/codae-questiona-nutrisupervisor/`,
    params,
  );

export const CODAERespondeReclamante = async (uuid, params) =>
  await axios.patch(`/reclamacoes-produtos/${uuid}/codae-responde/`, params);

export const CODAEPedeAnaliseSensorialProdutoReclamacao = async (
  uuid,
  justificativa,
  uuidTerceirizada,
) => {
  const url = `/reclamacoes-produtos/${uuid}/codae-pede-analise-sensorial/`;
  const response = await axios
    .patch(url, { justificativa, uuidTerceirizada })
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getNomesProdutos = async () =>
  await axios.get(`/produtos/lista-nomes-responder-reclamacao-escola/`);

export const getMarcas = async () =>
  await axios.get(`/marcas/lista-nomes-responder-reclamacao-escola/`);

export const getFabricantes = async () =>
  await axios.get(`/fabricantes/lista-nomes-responder-reclamacao-escola/`);

export const filtrarReclamacoesEscola = async (params) => {
  const url = `${API_URL}/produtos/filtro-reclamacoes-escola/${params}`;
  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET",
  };
  return fetch(url, OBJ_REQUEST)
    .then((result) => {
      return result.json();
    })
    .catch((error) => {
      return error;
    });
};

export const responderQuestionamentoUE = (params, uuid) =>
  axios.patch(`/reclamacoes-produtos/${uuid}/escola-responde/`, params);

export const getNomesProdutosNutrisupervisor = async () =>
  await axios.get(
    `/produtos/lista-nomes-responder-reclamacao-nutrisupervisor/`,
  );

export const getMarcasNutrisupervisor = async () =>
  await axios.get(`/marcas/lista-nomes-responder-reclamacao-nutrisupervisor/`);

export const getFabricantesNutrisupervisor = async () =>
  await axios.get(
    `/fabricantes/lista-nomes-responder-reclamacao-nutrisupervisor/`,
  );

export const filtrarReclamacoesNutrisupervisor = async (params) => {
  const url = `${API_URL}/produtos/filtro-reclamacoes-nutrisupervisor/${params}`;
  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET",
  };
  return fetch(url, OBJ_REQUEST)
    .then((result) => {
      return result.json();
    })
    .catch((error) => {
      return error;
    });
};

export const responderQuestionamentoNutrisupervisor = (params, uuid) =>
  axios.patch(
    `/reclamacoes-produtos/${uuid}/nutrisupervisor-responde/`,
    params,
  );
