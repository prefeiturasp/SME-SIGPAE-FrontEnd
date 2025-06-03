import axios from "./_base";
import { getMensagemDeErro } from "src/helpers/statusErrors";
import { toastError } from "src/components/Shareable/Toast/dialogs";
export const cadastraRascunhoFichaRecebimento = async (payload) => {
  try {
    return await axios.post("/rascunho-ficha-de-recebimento/", payload);
  } catch (error) {
    toastError(getMensagemDeErro(error.response.status));
  }
};
export const listarFichasRecebimentos = async (params) => {
  try {
    return await axios.get("/fichas-de-recebimento/", { params });
  } catch (error) {
    toastError(getMensagemDeErro(error.response.status));
  }
};
