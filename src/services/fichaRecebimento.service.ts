import {
  FichaRecebimentoPayload,
  ResponseFichasDeRecebimento,
} from "src/components/screens/Recebimento/FichaRecebimento/interfaces";
import axios from "./_base";
import { ResponseFichaRecebimento } from "src/interfaces/responses.interface";
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
