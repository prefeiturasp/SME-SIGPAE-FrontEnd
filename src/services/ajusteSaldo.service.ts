import axios from "./_base";
import { getMensagemDeErro } from "../helpers/statusErrors";
import { toastError } from "../components/Shareable/Toast/dialogs";

export const cadastraAjusteSaldo = async (payload) =>
  await axios.post("/ajuste-saldo-laudo/", payload);

export const getCronogramasMensalComDocs = async () => {
  try {
    return await axios.get(
      `/ajuste-saldo-laudo/cronogramas-mensal-com-documentos/`,
    );
  } catch (error) {
    toastError(getMensagemDeErro(error.response?.status));
  }
};

export const getDocumentosDoCronograma = async (cronograma_uuid: string) => {
  try {
    return await axios.get(`/ajuste-saldo-laudo/documentos-do-cronograma/`, {
      params: {
        cronograma_uuid,
      },
    });
  } catch (error) {
    toastError(getMensagemDeErro(error.response?.status));
  }
};
