import { saveAs } from "file-saver";

import { API_URL } from "../constants/config";
import authService from "./auth";

import axios from "./_base";
import { ENDPOINT_RELATORIO_QUANTITATIVO } from "src/constants/shared";
import { ErrorHandlerFunction } from "./service-helpers";
import { getMensagemDeErro } from "src/helpers/statusErrors";
import { toastError } from "src/components/Shareable/Toast/dialogs";

const authToken = {
  Authorization: `JWT ${authService.getToken()}`,
  "Content-Type": "application/json",
};

export const getTerceirizada = async (filtros = null) => {
  let url = "/terceirizadas/";
  if (filtros) {
    url += `?${filtros}`;
  }
  try {
    const response = await axios.get(url);
    return { data: response.data, status: response.status };
  } catch (error) {
    toastError(getMensagemDeErro(error.response.status));
  }
};

export const listaSimplesTerceirizadas = async () => {
  try {
    return await axios.get("/terceirizadas/lista-simples/");
  } catch (error) {
    toastError(getMensagemDeErro(error.response.status));
  }
};

export const getTerceirizadaUUID = async (uuid) =>
  await axios.get(`/terceirizadas/${uuid}/`);

export const createNaoTerceirizada = async (payload) =>
  await axios.post("/empresas-nao-terceirizadas/", payload);

export const createTerceirizada = (payload) => {
  const url = `${API_URL}/terceirizadas/`;

  let status = 0;
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
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

export const updateTerceirizada = (uuid, payload) => {
  const url = `${API_URL}/terceirizadas/${uuid}/`;

  let status = 0;
  return fetch(url, {
    method: "PUT",
    body: JSON.stringify(payload),
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

export const updateNaoTerceirizada = async (uuid, payload) =>
  await axios.patch(`/empresas-nao-terceirizadas/${uuid}/`, payload);

export const encerraContratoTerceirizada = async (uuid) => {
  const url = `/contratos/${uuid}/encerrar-contrato/`;
  const response = await axios.patch(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const obterNumeroContratosCadastrados = async () =>
  await axios.get("/contratos/numeros-contratos-cadastrados/");

export const getRelatorioQuantitativo = async (params) => {
  if (params) {
    return await axios.get(ENDPOINT_RELATORIO_QUANTITATIVO, { params });
  }
  return await axios.get(ENDPOINT_RELATORIO_QUANTITATIVO);
};

export const getPdfRelatorioQuantitativo = async (params) => {
  const { data } = await axios.get(
    "/terceirizadas/imprimir-relatorio-quantitativo/",
    {
      responseType: "blob",
      params,
    },
  );
  saveAs(data, "relatorio_quantitativo_por_terceirizada.pdf");
};

export const getEmpresasCronograma = async () =>
  await axios.get("/terceirizadas/lista-empresas-cronograma/");

export const getCNPJsEmpresas = async () =>
  await axios.get("/terceirizadas/lista-cnpjs/");

export const getEmailsTerceirizadasPorModulo = async (params) => {
  const url = `/terceirizadas/emails-por-modulo/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const createEmailsTerceirizadasPorModulo = async (payload) => {
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

export const deleteEmailsTerceirizadasPorModulo = async (uuid) => {
  const url = `/emails-terceirizadas-modulos/${uuid}/`;
  const response = await axios.delete(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getListaModalidades = async () => {
  try {
    return await axios.get("/modalidades/");
  } catch (error) {
    toastError(getMensagemDeErro(error.response.status));
  }
};
