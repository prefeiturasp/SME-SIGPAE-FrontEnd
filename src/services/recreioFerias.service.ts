import { ResponseFichasDeRecebimento } from "src/components/screens/Recebimento/FichaRecebimento/interfaces";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { getMensagemDeErro } from "src/helpers/statusErrors";
import axios from "./_base";

export const cadastrarRecreioNasFerias = async (payload) =>
  await axios.post("/medicao-inicial/recreio-nas-ferias/", payload);

export const listarRecreioNasFerias = async (
  params?: URLSearchParams
): Promise<ResponseFichasDeRecebimento> => {
  try {
    return await axios.get("/medicao-inicial/recreio-nas-ferias/", { params });
  } catch (error) {
    toastError(getMensagemDeErro(error.response.status));
  }
};
