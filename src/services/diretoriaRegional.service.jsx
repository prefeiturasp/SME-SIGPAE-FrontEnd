import { API_URL } from "../constants/config";
import authService from "./auth";
import axios from "./_base";
import { ErrorHandlerFunction } from "./service-helpers";

const authToken = {
  Authorization: `JWT ${authService.getToken()}`,
  "Content-Type": "application/json",
};

export const getLotes = async () => {
  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET",
  };

  const url = API_URL + "/lotes/";
  OBJ_REQUEST["method"] = "GET";
  return await fetch(url, OBJ_REQUEST).then((response) => {
    return response.json();
  });
};

export const getDiretoriaregional = async (params) => {
  const url = `${API_URL}/diretorias-regionais/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getDiretoriaregionalDetalhe = async (uuid) => {
  const url = `${API_URL}/diretorias-regionais/${uuid}/`;
  const response = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getDiretoriaregionalSimplissima = async (params) => {
  const url = `${API_URL}/diretorias-regionais-simplissima/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
