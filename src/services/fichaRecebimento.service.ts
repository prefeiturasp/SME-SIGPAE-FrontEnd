import {
  FichaRecebimentoPayload,
  ResponseFichasDeRecebimento,
} from "src/components/screens/Recebimento/FichaRecebimento/interfaces";
import axios from "./_base";
import {
  ResponseFichaRecebimento,
  ResponseFichaRecebimentoDetalhada,
  ResponseReposicaoCronograma,
} from "src/interfaces/responses.interface";
import { getMensagemDeErro } from "src/helpers/statusErrors";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { AxiosRequestConfig } from "axios";
import { saveAs } from "file-saver";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  skipAuthRefresh?: boolean;
}

export const cadastraRascunhoFichaRecebimento = async (
  payload: FichaRecebimentoPayload,
): Promise<ResponseFichaRecebimento> => {
  try {
    return await axios.post("/rascunho-ficha-de-recebimento/", payload);
  } catch (error) {
    toastError(getMensagemDeErro(error.response.status));
  }
};

export const editaRascunhoFichaRecebimento = async (
  payload: FichaRecebimentoPayload,
  uuid: string,
): Promise<ResponseFichaRecebimento> =>
  await axios.put(`/rascunho-ficha-de-recebimento/${uuid}/`, payload);

export const editarFichaRecebimento = async (
  payload: FichaRecebimentoPayload,
  uuid: string,
): Promise<ResponseFichaRecebimento> =>
  await axios.put(`/fichas-de-recebimento/${uuid}/`, payload, {
    skipAuthRefresh: true,
  } as CustomAxiosRequestConfig);

export const cadastraFichaRecebimento = async (
  payload: FichaRecebimentoPayload,
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

export const cadastraFichaRecebimentoSaldoZero = async (
  payload: FichaRecebimentoPayload,
): Promise<ResponseFichaRecebimento> => {
  try {
    return await axios.post(
      "/fichas-de-recebimento/cadastrar-saldo-zero/",
      payload,
      {
        skipAuthRefresh: true,
      } as CustomAxiosRequestConfig,
    );
  } catch (error) {
    if (error.response.status === 401) toastError(error.response.data[0]);
    else toastError(getMensagemDeErro(error.response.status));
  }
};

export const editaFichaRecebimentoSaldoZero = async (
  payload: FichaRecebimentoPayload,
  uuid: string,
): Promise<ResponseFichaRecebimento> => {
  try {
    return await axios.put(
      `/fichas-de-recebimento/${uuid}/atualizar-saldo-zero/`,
      payload,
      {
        skipAuthRefresh: true,
      } as CustomAxiosRequestConfig,
    );
  } catch (error) {
    if (error.response.status === 401) toastError(error.response.data[0]);
    else toastError(getMensagemDeErro(error.response.status));
  }
};

export const cadastraReposicaoFichaRecebimento = async (
  payload: FichaRecebimentoPayload,
): Promise<ResponseFichaRecebimento> => {
  try {
    return await axios.post("/reposicao-ficha-de-recebimento/", payload);
  } catch (error) {
    toastError(getMensagemDeErro(error.response.status));
  }
};

export const editaReposicaoFichaRecebimento = async (
  payload: FichaRecebimentoPayload,
  uuid: string,
): Promise<ResponseFichaRecebimento> =>
  await axios.put(`/reposicao-ficha-de-recebimento/${uuid}/`, payload);

export const listarFichasRecebimentos = async (
  params: URLSearchParams,
): Promise<ResponseFichasDeRecebimento> => {
  try {
    return await axios.get("/fichas-de-recebimento/", { params });
  } catch (error) {
    toastError(getMensagemDeErro(error.response.status));
  }
};

export const getFichaRecebimentoDetalhada = async (
  uuid: string,
): Promise<ResponseFichaRecebimentoDetalhada> => {
  try {
    return await axios.get(`/fichas-de-recebimento/${uuid}/`);
  } catch (error) {
    toastError(getMensagemDeErro(error.response.status));
  }
};

export const imprimirFichaRecebimento = async (
  uuid: string,
  numero: string,
) => {
  const url = `/fichas-de-recebimento/${uuid}/gerar-pdf-ficha/`;
  const { data } = await axios.get(url, { responseType: "blob" });
  saveAs(data, "ficha_recebimento_" + numero + ".pdf");
};

export const listarOpcoesReposicao =
  async (): Promise<ResponseReposicaoCronograma> =>
    await axios.get("/reposicao-cronograma-ficha-recebimento/");
