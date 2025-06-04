import { getMensagemDeErro } from "../helpers/statusErrors";
import { toastError } from "src/components/Shareable/Toast/dialogs";

import axios from "./_base";
import { ErrorHandlerFunction } from "./service-helpers";

export const cadastraLayoutEmbalagem = async (payload) =>
  await axios.post("/layouts-de-embalagem/", payload);

export const listarLayoutsEmbalagens = async (params) => {
  try {
    return await axios.get("/layouts-de-embalagem/", { params });
  } catch (error) {
    toastError(getMensagemDeErro(error.response.status));
  }
};

export const detalharLayoutEmabalagem = async (uuid) => {
  try {
    return await axios.get(`/layouts-de-embalagem/${uuid}/`);
  } catch (error) {
    toastError(getMensagemDeErro(error.response.status));
  }
};

export const getDashboardLayoutEmbalagem = async (params = null) => {
  const url = `/layouts-de-embalagem/dashboard/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const corrigirLayoutEmbalagem = async (uuid, payload) =>
  await axios.patch(
    `/layouts-de-embalagem/${uuid}/fornecedor-realiza-correcao/`,
    payload
  );

export const analiseCodaeLayoutEmbalagem = async (uuid, payload) => {
  try {
    return await axios.patch(
      `/layouts-de-embalagem/${uuid}/codae-aprova-ou-solicita-correcao/`,
      payload
    );
  } catch (error) {
    toastError(getMensagemDeErro(error.response.status));
  }
};

export const atualizacaoLayoutEmbalagem = async (uuid, payload) =>
  await axios.patch(`/layouts-de-embalagem/${uuid}/`, payload);
