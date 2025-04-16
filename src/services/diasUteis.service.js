import axios from "./_base";
import { API_URL } from "../constants/config";
import { ErrorHandlerFunction } from "./service-helpers";

export const getDiasUteis = async (params) => {
  const url = `${API_URL}/dias-uteis/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getFeriadosAno = async () => {
  const url = `${API_URL}/feriados-ano/`;
  const response = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getFeriadosAnoAtualEProximo = async () => {
  const url = `${API_URL}/feriados-ano/ano-atual-e-proximo/`;
  const response = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
