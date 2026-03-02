import { API_URL } from "../constants/config";
import authService from "./auth";
import axios from "src/services/_base";
import { ErrorHandlerFunction } from "./service-helpers";

const authToken = {
  Authorization: `JWT ${authService.getToken()}`,
  "Content-Type": "application/json",
};

export const criarEditalEContrato = async (payload) => {
  const url = `${API_URL}/editais-contratos/`;
  const response = await axios.post(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const updateEditalContrato = async (payload, uuid) => {
  const url = `${API_URL}/editais-contratos/${uuid}/`;
  const response = await axios.put(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getEditaisContratos = async (params) => {
  const url = `${API_URL}/editais-contratos/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getEditalContrato = async (uuid) => {
  const url = `${API_URL}/editais-contratos/${uuid}/`;
  const response = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const excluirEdital = async (uuid) => {
  const OBJ_REQUEST = {
    headers: authToken,
    method: "DELETE",
  };
  let status = 0;
  return await fetch(`${API_URL}/editais-contratos/${uuid}/`, OBJ_REQUEST)
    .then((res) => {
      status = res.status;
      return res.json();
    })
    .then((data) => {
      return { data: data, status: status };
    })
    .catch((error) => {
      return { data: error, status: status };
    });
};

export const getNumerosEditais = async (params = {}) => {
  const url = `/editais/lista-numeros/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
