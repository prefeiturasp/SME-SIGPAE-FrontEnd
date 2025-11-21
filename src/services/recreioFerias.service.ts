import { toastError } from "src/components/Shareable/Toast/dialogs";
import { getMensagemDeErro } from "src/helpers/statusErrors";
import axios from "./_base";

export const cadastrarRecreioNasFerias = async (payload) =>
  await axios.post("/medicao-inicial/recreio-nas-ferias/", payload);

export const listarRecreioNasFerias = async (params?: URLSearchParams) => {
  try {
    return await axios.get("/medicao-inicial/recreio-nas-ferias/", { params });
  } catch (error) {
    toastError(getMensagemDeErro(error.response.status));
  }
};

export const buscarRecreioNasFeriasPorUuid = async (uuid: string) =>
  await axios.get(`/medicao-inicial/recreio-nas-ferias/${uuid}/`);

export const atualizarRecreioNasFerias = (uuid: string, payload: any) =>
  axios.put(`/recreio-nas-ferias/${uuid}/`, payload);
