import {
  FichaRecebimentoPayload,
  ResponseFichasDeRecebimento,
} from "src/components/screens/Recebimento/FichaRecebimento/interfaces";
import axios from "./_base";
import {
  ResponseFichaRecebimento,
  ResponseFichaRecebimentoDetalhada,
} from "src/interfaces/responses.interface";
import { getMensagemDeErro } from "src/helpers/statusErrors";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { AxiosRequestConfig } from "axios";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  skipAuthRefresh?: boolean;
}

export const cadastraRascunhoFichaRecebimento = async (
  payload: FichaRecebimentoPayload
): Promise<ResponseFichaRecebimento> => {
  try {
    return await axios.post("/rascunho-ficha-de-recebimento/", payload);
  } catch (error) {
    toastError(getMensagemDeErro(error.response.status));
  }
};

export const editaRascunhoFichaRecebimento = async (
  payload: FichaRecebimentoPayload,
  uuid: string
): Promise<ResponseFichaRecebimento> =>
  await axios.put(`/rascunho-ficha-de-recebimento/${uuid}/`, payload);

export const cadastrarFichaRecebimentoDoRascunho = async (
  payload: FichaRecebimentoPayload,
  uuid: string
): Promise<ResponseFichaRecebimento> =>
  await axios.put(`/fichas-de-recebimento/${uuid}/`, payload, {
    skipAuthRefresh: true,
  } as CustomAxiosRequestConfig);

export const cadastraFichaRecebimento = async (
  payload: FichaRecebimentoPayload
): Promise<ResponseFichaRecebimento> => {
  try {
    return await axios.post("/fichas-de-recebimento/", payload, {
      skipAuthRefresh: true,
    } as CustomAxiosRequestConfig);
  } catch (error) {
    if (error.response.status === 401) toastError(error.response.data[0]);
    else toastError(getMensagemDeErro(error.response.status));
  }
};

export const listarFichasRecebimentos = async (
  params: URLSearchParams
): Promise<ResponseFichasDeRecebimento> => {
  try {
    return await axios.get("/fichas-de-recebimento/", { params });
  } catch (error) {
    toastError(getMensagemDeErro(error.response.status));
  }
};

export const getFichaRecebimentoDetalhada = async (
  uuid: string
): Promise<ResponseFichaRecebimentoDetalhada> => {
  try {
    return await axios.get(`/fichas-de-recebimento/${uuid}/`);
  } catch (error) {
    toastError(getMensagemDeErro(error.response.status));
  }
};
