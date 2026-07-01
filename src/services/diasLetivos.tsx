import axios from "./_base";
import { ErrorHandlerFunction } from "./service-helpers";

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
