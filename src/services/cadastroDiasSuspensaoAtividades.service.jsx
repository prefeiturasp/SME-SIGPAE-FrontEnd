import axios from "./_base";
import { ErrorHandlerFunction } from "src/services/service-helpers";

export const getDiasSuspensaoAtividades = async (params = null) => {
  const url = `dias-suspensao-atividades/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const setDiaSuspensaoAtividades = async (payload) => {
  const url = `dias-suspensao-atividades/`;
  const response = await axios.post(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const deleteDiaSuspensaoAtividades = async (uuid) => {
  const url = `dias-suspensao-atividades/${uuid}/`;
  const response = await axios.delete(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getListaDiasSuspensaoAtividades = async (params = null) => {
  const url = `dias-suspensao-atividades/lista-dias/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
