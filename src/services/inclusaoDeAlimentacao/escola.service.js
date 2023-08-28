import { API_URL } from "../../constants/config";
import { FLUXO, AUTH_TOKEN } from "services/constants";
import { getPath } from "./helper";
import { ErrorHandlerFunction } from "services/service-helpers";
import axios from "../_base";

export const createInclusaoAlimentacao = async (payload, tipoSolicitacao) => {
  const url = `${getPath(tipoSolicitacao)}/`;
  const response = await axios.post(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const iniciaFluxoInclusaoAlimentacao = async (uuid, tipoSolicitacao) => {
  const url = `${getPath(tipoSolicitacao)}/${uuid}/${FLUXO.INICIO_PEDIDO}/`;
  const response = await axios.patch(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const updateInclusaoAlimentacao = async (
  uuid,
  payload,
  tipoSolicitacao
) => {
  const url = `${getPath(tipoSolicitacao)}/${uuid}/`;
  const response = await axios.put(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const escolaExcluirSolicitacaoDeInclusaoDeAlimentacao = async (
  uuid,
  tipoSolicitacao
) => {
  const OBJ_REQUEST = {
    headers: AUTH_TOKEN,
    method: "DELETE",
  };
  let status = 0;
  return await fetch(`${getPath(tipoSolicitacao)}/${uuid}/`, OBJ_REQUEST)
    .then((res) => {
      status = res.status;
      return res.json();
    })
    .then((data) => {
      return { data: data, status: status };
    })
    .catch((error) => {
      return { data: error, status: status };
    });
};

export const escolaCancelarSolicitacaoDeInclusaoDeAlimentacao = async (
  uuid,
  payload,
  tipoSolicitacao
) => {
  const url = `${getPath(tipoSolicitacao)}/${uuid}/${FLUXO.ESCOLA_CANCELA}/`;
  const OBJ_REQUEST = {
    headers: AUTH_TOKEN,
    method: "PATCH",
    body: JSON.stringify(payload),
  };
  let status = 0;
  try {
    const res = await fetch(url, OBJ_REQUEST);
    const data = await res.json();
    status = res.status;
    return { ...data, status: status };
  } catch (error) {
    return error.json();
  }
};

export const getMotivosInclusaoNormal = async () => {
  const url = `${API_URL}/motivos-inclusao-normal/`;
  const response = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getMotivosInclusaoContinua = async () => {
  const url = `${API_URL}/motivos-inclusao-continua/`;
  const response = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const createInclusaoAlimentacaoCEMEI = async (payload) => {
  const url = `inclusao-alimentacao-cemei/`;
  const response = await axios.post(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const updateInclusaoAlimentacaoCEMEI = async (uuid, payload) => {
  const url = `inclusao-alimentacao-cemei/${uuid}/`;
  const response = await axios.put(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getInclusaoCEMEIRascunhos = async () => {
  const url = `inclusao-alimentacao-cemei/`;
  const response = await axios
    .get(url, { params: { status: "RASCUNHO" } })
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const iniciaFluxoInclusaoAlimentacaoCEMEI = async (uuid) => {
  const url = `inclusao-alimentacao-cemei/${uuid}/${FLUXO.INICIO_PEDIDO}/`;
  const response = await axios.patch(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const deleteInclusaoDeAlimentacaoCEMEI = async (uuid) => {
  const url = `inclusao-alimentacao-cemei/${uuid}/`;
  const response = await axios.delete(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getInclusaoCEMEI = async (uuid) => {
  const url = `inclusao-alimentacao-cemei/${uuid}/`;
  const response = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
