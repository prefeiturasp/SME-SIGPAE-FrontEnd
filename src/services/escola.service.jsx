import axios from "./_base";
import { API_URL } from "../constants/config";
import authService from "./auth";
import { ErrorHandlerFunction } from "./service-helpers";

const authToken = {
  Authorization: `JWT ${authService.getToken()}`,
  "Content-Type": "application/json",
};

export const buscaPeriodosEscolares = async (params) => {
  const url = `${API_URL}/periodos-escolares/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getEscolasSimplissima = async (params = {}) => {
  const url = `${API_URL}/escolas-simplissima/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getEscolasParaFiltros = async (params = {}) => {
  let url = `${API_URL}/escolas-para-filtros/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getEscolaPeriodosEscolares = async (uuid) => {
  let url = `${API_URL}/escolas-para-filtros/${uuid}/periodos-escolares/`;
  const response = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getEscolaTiposAlimentacao = async (uuid) => {
  let url = `${API_URL}/escolas-para-filtros/${uuid}/tipos-alimentacao/`;
  const response = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getEscolasSimplissimaComDRE = () => {
  const url = `${API_URL}/escolas-simplissima-com-dre/`;
  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET",
  };
  return fetch(url, OBJ_REQUEST)
    .then((result) => {
      return result.json();
    })
    .catch((error) => {
      return error.json();
    });
};

export const getEscolasSimplissimaComDREUnpaginated = async () =>
  axios.get("escolas-simplissima-com-dre-unpaginated/");

export const getEscolasTercTotal = async (params = {}) => {
  const url = "escolas-simplissima-com-dre-unpaginated/terc-total/";
  const response = await axios
    .get(url, { params: params })
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getEscolasSimplissimaPorDiretoriaRegional = (dre_uuid) => {
  const url = `${API_URL}/escolas-simplissima/${dre_uuid}/`;
  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET",
  };
  return fetch(url, OBJ_REQUEST)
    .then((result) => {
      return result.json();
    })
    .catch((error) => {
      return error.json();
    });
};

export const getTiposGestao = async () => {
  const url = `${API_URL}/tipos-gestao/`;
  const response = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getSubprefeituras = async () => {
  const url = `${API_URL}/subprefeituras/`;
  const response = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getQuantidaDeAlunosPorPeriodoEEscola = async (uuidEscola) => {
  const url = `${API_URL}/quantidade-alunos-por-periodo/escola/${uuidEscola}/`;
  const response = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getEscolaSimples = async (uuidEscola, params = null) => {
  const url = uuidEscola
    ? `/escolas-simples/${uuidEscola}/`
    : "/escolas-simples/";
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getGrupoUnidadeEscolar = async () => {
  const url = `${API_URL}/grupos-unidade-escolar/`;
  const response = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getQuantidadeAlunosMatriculadosPorData = async (params) => {
  const url = `${API_URL}/matriculados-no-mes/quantidade-por-data/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getGruposExistentesPorDre = async (params) => {
  let url = `${API_URL}/grupos-unidade-escolar/por-dre/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
