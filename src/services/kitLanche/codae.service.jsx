import axios from "../_base";
import { FLUXO, PEDIDOS, AUTH_TOKEN } from "src/services/constants";
import { getPath } from "./helper";
import { ErrorHandlerFunction } from "src/services/service-helpers";

export const CODAEquestionaKitLancheAvulso = async (
  uuid,
  payload,
  tipoSolicitacao
) => {
  const url = `${getPath(tipoSolicitacao)}/${uuid}/${FLUXO.CODAE_QUESTIONA}/`;
  const response = await axios.patch(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const CODAENegaKitLancheAvulso = async (
  uuid,
  payload,
  tipoSolicitacao
) => {
  const url = `${getPath(tipoSolicitacao)}/${uuid}/${FLUXO.CODAE_NEGA}/`;
  const response = await axios.patch(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const CODAEAutorizaKitLancheAvulso = (
  uuid,
  justificativa = {},
  tipoSolicitacao
) => {
  const url = `${getPath(tipoSolicitacao)}/${uuid}/${FLUXO.CODAE_AUTORIZA}/`;
  const OBJ_REQUEST = {
    headers: AUTH_TOKEN,
    body: JSON.stringify(justificativa),
    method: "PATCH",
  };
  let status = 0;
  return fetch(url, OBJ_REQUEST)
    .then((res) => {
      status = res.status;
      return res.json();
    })
    .then((data) => {
      return { data: data, status: status };
    })
    .catch((error) => {
      return error.json();
    });
};

export const getCODAEPedidosKitLanchePendentes = (
  filtroAplicado,
  tipoSolicitacao
) => {
  const url = `${getPath(tipoSolicitacao)}/${PEDIDOS.CODAE}/${filtroAplicado}/`;
  const OBJ_REQUEST = {
    headers: AUTH_TOKEN,
    method: "GET",
  };
  return fetch(url, OBJ_REQUEST)
    .then((result) => {
      return result.json();
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getCodaePedidosDeKitLanche = async (
  filtroAplicado,
  tipoSolicitacao,
  paramsFromPrevPage
) => {
  const url = `${getPath(tipoSolicitacao)}/${PEDIDOS.CODAE}/${filtroAplicado}/`;
  const response = await axios.get(url, { params: paramsFromPrevPage });
  return response.data;
};

export const CODAENegaKitLancheCEMEI = async (uuid, payload) => {
  const url = `solicitacao-kit-lanche-cemei/${uuid}/${FLUXO.CODAE_NEGA}/`;
  const response = await axios.patch(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const CODAEAutorizaKitLancheCEMEI = async (uuid, payload) => {
  const url = `solicitacao-kit-lanche-cemei/${uuid}/${FLUXO.CODAE_AUTORIZA}/`;
  const response = await axios.patch(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const CODAEquestionaKitLancheCEMEI = async (uuid, payload) => {
  const url = `solicitacao-kit-lanche-cemei/${uuid}/${FLUXO.CODAE_QUESTIONA}/`;
  const response = await axios.patch(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
