import axios from "../_base";
import { FLUXO, AUTH_TOKEN } from "src/services/constants";
import { getPath } from "./helper";
import { ErrorHandlerFunction } from "src/services/service-helpers";

export const solicitarKitLanche = async (values, tipoSolicitacao) => {
  const url = getPath(tipoSolicitacao);

  let status = 0;
  const OBJ_REQUEST = {
    headers: AUTH_TOKEN,
    method: "POST",
    body: JSON.stringify(values),
  };
  return await fetch(`${url}/`, OBJ_REQUEST)
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

export const registroAtualizaKitLanche = (payload, uuid, tipoSolicitacao) => {
  const url = `${getPath(tipoSolicitacao)}/${uuid}/`;

  if (tipoSolicitacao) {
    return axios.patch(url, payload);
  }

  let status = 0;
  return fetch(url, {
    method: "PUT",
    body: JSON.stringify(payload),
    headers: AUTH_TOKEN,
  })
    .then((response) => {
      status = response.status;
      return response.json();
    })
    .then((data) => {
      return { data: data, status: status };
    })
    .catch((error) => {
      return error.json();
    });
};

export const cancelaKitLancheAvulsoEscola = async (
  uuid,
  justificativa,
  tipoSolicitacao
) => {
  const url = `${getPath(tipoSolicitacao)}/${uuid}/${FLUXO.ESCOLA_CANCELA}/`;
  const response = await axios
    .patch(url, { justificativa })
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const createSolicitacaoKitLancheCEMEI = async (payload) => {
  const url = `solicitacao-kit-lanche-cemei/`;
  const response = await axios.post(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const updateSolicitacaoKitLancheCEMEI = async (uuid, payload) => {
  const url = `solicitacao-kit-lanche-cemei/${uuid}/`;
  const response = await axios.put(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getSolicitacaoKitLancheCEMEIRascunhos = async () => {
  const url = `solicitacao-kit-lanche-cemei/`;
  const response = await axios
    .get(url, { params: { status: "RASCUNHO" } })
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const deleteSolicitacaoKitLancheCEMEI = async (uuid) => {
  const url = `solicitacao-kit-lanche-cemei/${uuid}/`;
  const response = await axios.delete(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const iniciaFluxoSolicitacaoKitLancheCEMEI = async (uuid) => {
  const url = `solicitacao-kit-lanche-cemei/${uuid}/${FLUXO.INICIO_PEDIDO}/`;
  const response = await axios.patch(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getSolicitacaoKitLancheCEMEI = async (uuid) => {
  const url = `solicitacao-kit-lanche-cemei/${uuid}/`;
  const response = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const cancelaFluxoSolicitacaoKitLancheCEMEI = async (uuid, payload) => {
  const url = `solicitacao-kit-lanche-cemei/${uuid}/${FLUXO.ESCOLA_CANCELA}/`;
  const response = await axios.patch(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const DRENaoValidaKitLancheCEMEI = async (uuid, payload) => {
  const url = `solicitacao-kit-lanche-cemei/${uuid}/${FLUXO.DRE_NAO_VALIDA}/`;
  const response = await axios.patch(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const DREValidaKitLancheCEMEI = async (uuid) => {
  const url = `solicitacao-kit-lanche-cemei/${uuid}/${FLUXO.DRE_VALIDA}/`;
  const response = await axios.patch(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
