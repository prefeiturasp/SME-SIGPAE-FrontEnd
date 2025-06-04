import {
  FichaRecebimentoPayload,
  ResponseFichasDeRecebimento,
} from "src/components/screens/Recebimento/FichaRecebimento/interfaces";
import axios from "./_base";
import { ResponseFichaRecebimento } from "interfaces/responses.interface";
import { getMensagemDeErro } from "src/helpers/statusErrors";
import { toastError } from "src/components/Shareable/Toast/dialogs";

export const cadastraRascunhoFichaRecebimento = async (
  payload: FichaRecebimentoPayload
): Promise<ResponseFichaRecebimento> => {
  try {
    return await axios.post("/rascunho-ficha-de-recebimento/", payload);
  } catch (error) {
    toastError(getMensagemDeErro(error.response.status));
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
