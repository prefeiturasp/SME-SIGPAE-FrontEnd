import { saveAs } from "file-saver";

import { API_URL } from "../constants/config";
import authService from "./auth";

import axios from "./_base";
import { ENDPOINT_RELATORIO_QUANTITATIVO } from "constants/shared";
import { ErrorHandlerFunction } from "./service-helpers";

const authToken = {
  Authorization: `JWT ${authService.getToken()}`,
  "Content-Type": "application/json"
};

export const getTerceirizada = (filtros = null) => {
  let url = `${API_URL}/terceirizadas/`;
  if (filtros) {
    url += `?${filtros}`;
  }
  let status = 0;
  return fetch(url, {
    headers: authToken,
    method: "GET"
  })
    .then(response => {
      status = response.status;
      return response.json();
    })
    .then(data => {
      return { data: data, status: status };
    })
    .catch(error => {
      return error.json();
    });
};

export const getTerceirizada_razoes = () => {
  const url = `${API_URL}/terceirizadas/lista-razoes/`;
  let status = 0;
  return fetch(url, {
    headers: authToken,
    method: "GET"
  })
    .then(response => {
      status = response.status;
      return response.json();
    })
    .then(data => {
      return { data: data, status: status };
    })
    .catch(error => {
      return error.json();
    });
};

export const getTerceirizadaUUID = uuid => {
  const url = `${API_URL}/terceirizadas/${uuid}/`;
  let status = 0;
  return fetch(url, {
    headers: authToken,
    method: "GET"
  })
    .then(response => {
      status = response.status;
      return response.json();
    })
    .then(data => {
      return { data: data, status: status };
    })
    .catch(error => {
      return error.json();
    });
};

export const createTerceirizada = payload => {
  const url = `${API_URL}/terceirizadas/`;

  let status = 0;
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: authToken
  })
    .then(res => {
      status = res.status;
      return res.json();
    })
    .then(data => {
      return { data: data, status: status };
    })
    .catch(error => {
      return error.json();
    });
};

export const updateTerceirizada = (uuid, payload) => {
  const url = `${API_URL}/terceirizadas/${uuid}/`;

  let status = 0;
  return fetch(url, {
    method: "PUT",
    body: JSON.stringify(payload),
    headers: authToken
  })
    .then(res => {
      status = res.status;
      return res.json();
    })
    .then(data => {
      return { data: data, status: status };
    })
    .catch(error => {
      return error.json();
    });
};

export const encerraContratoTerceirizada = async uuid =>
  await axios.patch(`/contratos/${uuid}/encerrar-contrato/`);

export const getRelatorioQuantitativo = async params => {
  if (params) {
    return await axios.get(ENDPOINT_RELATORIO_QUANTITATIVO, { params });
  }
  return await axios.get(ENDPOINT_RELATORIO_QUANTITATIVO);
};

export const getPdfRelatorioQuantitativo = async params => {
  const { data } = await axios.get(
    "/terceirizadas/imprimir-relatorio-quantitativo/",
    {
      responseType: "blob",
      params
    }
  );
  saveAs(data, "relatorio_quantitativo_por_terceirizada.pdf");
};

export const getFornecedoresSimples = async () =>
  await axios.get("/terceirizadas/lista-fornecedores-simples/");

export const getCNPJsEmpresas = async () =>
  await axios.get("/terceirizadas/lista-cnpjs/");

export const getEmailsTerceirizadasPorModulo = async params => {
  const url = `/terceirizadas/emails-por-modulo/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const createEmailsTerceirizadasPorModulo = async payload => {
  return axios.post(`/emails-terceirizadas-modulos/`, payload);
};

export const updateEmailsTerceirizadasPorModulo = async (uuid, payload) => {
  const url = `/emails-terceirizadas-modulos/${uuid}/`;
  const response = await axios.patch(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const deleteEmailsTerceirizadasPorModulo = async uuid => {
  const url = `/emails-terceirizadas-modulos/${uuid}/`;
  const response = await axios.delete(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
