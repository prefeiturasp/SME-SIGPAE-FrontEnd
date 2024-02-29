import axios from "./_base";
import { API_URL } from "../constants/config";
import authService from "./auth";
import { ErrorHandlerFunction } from "./service-helpers";

const authToken = {
  Authorization: `JWT ${authService.getToken()}`,
  "Content-Type": "application/json",
};

export const criarLote = (payload) => {
  const url = `${API_URL}/lotes/`;
  let status = 0;
  return fetch(url, {
    method: "POST",
    body: payload,
    headers: authToken,
  })
    .then((res) => {
      status = res.status;
      return res.json();
    })
    .then((data) => {
      return { data: data, status: status };
    })
    .catch((error) => {
      return error.json();
    });
};

export const atualizarLote = (payload, uuid) => {
  const url = `${API_URL}/lotes/${uuid}/`;
  let status = 0;
  return fetch(url, {
    method: "PUT",
    body: payload,
    headers: authToken,
  })
    .then((res) => {
      status = res.status;
      return res.json();
    })
    .then((data) => {
      return { data: data, status: status };
    })
    .catch((error) => {
      return error.json();
    });
};

export const excluirLote = async (uuid) => {
  const OBJ_REQUEST = {
    headers: authToken,
    method: "DELETE",
  };
  let status = 0;
  return await fetch(`${API_URL}/lotes/${uuid}/`, OBJ_REQUEST)
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
export const getLote = (uuid) => {
  const url = `${API_URL}/lotes/${uuid}/`;
  let status = 0;
  return fetch(url, {
    method: "GET",
    headers: authToken,
  })
    .then((res) => {
      status = res.status;
      return res.json();
    })
    .then((data) => {
      return { data: data, status: status };
    })
    .catch((error) => {
      return error.json();
    });
};

export const getLotes = (payload) => {
  const url = `${API_URL}/lotes/`;
  let status = 0;
  return fetch(url, {
    method: "GET",
    body: payload,
    headers: authToken,
  })
    .then((res) => {
      status = res.status;
      return res.json();
    })
    .then((data) => {
      return { ...data, status: status };
    })
    .catch((error) => {
      return error.json();
    });
};

export const getMeusLotes = async () => {
  const url = `${API_URL}/lotes/meus-lotes-vinculados/`;
  const response = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getLotesSimples = async (params = null) => {
  const url = `${API_URL}/lotes-simples/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
