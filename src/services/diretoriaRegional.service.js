import { API_URL } from "../constants/config";
import authService from "./auth";
import axios from "./_base";

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

export const getDiretoriaregional = () => {
  const url = `${API_URL}/diretorias-regionais/`;
  let status = 0;
  return fetch(url, {
    headers: authToken,
    method: "GET",
  })
    .then((response) => {
      status = response.status;
      return response.json();
    })
    .then((data) => {
      return { data: data, status: status };
    })
    .catch((error) => {
      return error.json();
    });
};

export const getDiretoriaregionalDetalhe = (uuid) => {
  const url = `${API_URL}/diretorias-regionais/${uuid}/`;
  let status = 0;
  return fetch(url, {
    headers: authToken,
    method: "GET",
  })
    .then((response) => {
      status = response.status;
      return response.json();
    })
    .then((data) => {
      return { data: data, status: status };
    })
    .catch((error) => {
      return error.json();
    });
};

export const getDiretoriaregionalSimplissima = () => {
  const url = `${API_URL}/diretorias-regionais-simplissima/`;
  let status = 0;
  return fetch(url, {
    headers: authToken,
    method: "GET",
  })
    .then((response) => {
      status = response.status;
      return response.json();
    })
    .then((data) => {
      return { data: data, status: status };
    })
    .catch((error) => {
      return error.json();
    });
};

export const getDiretoriaregionalSimplissimaAxios = async () =>
  axios.get("diretorias-regionais-simplissima/");
