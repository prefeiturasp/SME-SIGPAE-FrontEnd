import axios from "./_base";
import { ErrorHandlerFunction } from "./service-helpers";
import { DiasLetivosUpdateInterface } from "src/components/screens/Cadastros/DiasLetivosSIGPAE/Editar/interfaces";

export const cadastrarDiasLetivos = async (payload) => {
  const url = "/dias-letivos/";
  const response = await axios.post(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    return { data: response.data, status: response.status };
  }
};

export const listDiasLetivos = async (params) => {
  const url = "/dias-letivos/";
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    return { data: response.data, status: response.status };
  }
};

export const getDiaLetivo = async (uuid: string) => {
  const url = `/dias-letivos/${uuid}/`;
  const response = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    return { data: response.data, status: response.status };
  }
};

export const editarDiaLetivo = async (
  uuid: string,
  data: DiasLetivosUpdateInterface,
) => {
  const url = `/dias-letivos/${uuid}/`;
  const response = await axios.put(url, data).catch(ErrorHandlerFunction);
  if (response) {
    return { data: response.data, status: response.status };
  }
};

export const excluirDiaLetivo = async (uuid: string) => {
  const url = `/dias-letivos/${uuid}/`;
  const response = await axios.delete(url).catch(ErrorHandlerFunction);
  if (response) {
    return { data: response.data, status: response.status };
  }
};
