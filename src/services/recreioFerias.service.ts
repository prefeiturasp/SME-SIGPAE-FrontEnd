import axios from "./_base";
import { ErrorHandlerFunction } from "./service-helpers";

export const cadastrarRecreioNasFerias = async (payload) => {
  const url = `/medicao-inicial/recreio-nas-ferias/`;
  const response = await axios.post(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const listarRecreioNasFerias = async (params?: URLSearchParams) => {
  const url = "/medicao-inicial/recreio-nas-ferias/";
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const buscarRecreioNasFeriasPorUuid = async (uuid: string) => {
  const url = `/medicao-inicial/recreio-nas-ferias/${uuid}/`;
  const response = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const atualizarRecreioNasFerias = async (uuid: string, payload: any) => {
  const url = `/medicao-inicial/recreio-nas-ferias/${uuid}/`;
  const response = await axios.put(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
