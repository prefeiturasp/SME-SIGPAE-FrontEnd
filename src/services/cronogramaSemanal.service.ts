import axios from "./_base";
import { getMensagemDeErro } from "../helpers/statusErrors";
import { toastError } from "../components/Shareable/Toast/dialogs";
import {
  CronogramaSemanalCreate,
  CronogramaMensalSimples,
} from "src/interfaces/cronograma_semanal.interface";

export const getCronogramaSemanal = async (uuid: string) => {
  return await axios.get(`/cronogramas-semanais/${uuid}/`);
};

export const getListagemCronogramasSemanal = async (params) => {
  const url = `/cronogramas-semanais/`;
  return await axios.get(url, { params });
};

export const criarCronogramaSemanalRascunho = async (
  payload: CronogramaSemanalCreate,
  config = {},
) => {
  return await axios.post("/cronogramas-semanais/rascunho/", payload, config);
};

export const atualizarCronogramaSemanalRascunho = async (
  uuid: string,
  payload: CronogramaSemanalCreate,
  config = {},
) => {
  return await axios.patch(`/cronogramas-semanais/${uuid}/`, payload, config);
};

export const darCienciaCronogramaSemanal = async (
  uuid: string,
  config = {},
) => {
  const url = `/cronogramas-semanais/${uuid}/fornecedor-ciente/`;
  return axios.patch(url, config);
};

export const getCronogramasMensalAssinados = async (): Promise<{
  data: CronogramaMensalSimples[];
}> => {
  try {
    return await axios.get(
      "/cronogramas-semanais/cronogramas-mensal-assinados/",
    );
  } catch (error) {
    toastError(getMensagemDeErro(error.response?.status));
  }
};

export const getCronogramaMensalDetalhado = async (uuid: string) => {
  try {
    return await axios.get(`/cronogramas/${uuid}/`);
  } catch (error) {
    toastError(getMensagemDeErro(error.response?.status));
  }
};

export const assinarEEnviarCronogramaSemanal = async (
  uuid: string,
  payload: CronogramaSemanalCreate,
  password: string,
  config = {},
) => {
  return await axios.patch(
    `/cronogramas-semanais/${uuid}/assinar-e-enviar/`,
    { ...payload, password },
    config,
  );
};
