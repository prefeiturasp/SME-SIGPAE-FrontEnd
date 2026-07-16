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

export const getListagemAjustesSaldo = async (params) => {
  const url = `/ajuste-saldo-laudo/`;
  return await axios.get(url, { params });
};

export const getAjusteSaldo = async (uuid: string) => {
  const url = `/ajuste-saldo-laudo/${uuid}/`;
  return await axios.get(url);
};

export const atualizaAjusteSaldo = async (payload: {
  uuid: string;
  quantidade_descontada: number;
}) => {
  const { uuid, ...dados } = payload;
  return await axios.patch(`/ajuste-saldo-laudo/${uuid}/`, dados);
};

export const excluirAjusteSaldo = async (uuid) => {
  return await axios.delete(`/ajuste-saldo-laudo/${uuid}/`);
};
