import axios from "./_base";
import { API_URL } from "../constants/config";
import authService from "./auth";
import { ErrorHandlerFunction } from "./service-helpers";

const authToken = {
  Authorization: `JWT ${authService.getToken()}`,
  "Content-Type": "application/json",
};

// ESCOLA
export const getDietaEspecialPendenteAutorizacaoEscola = async (
  uuid,
  params,
) => {
  let url = `${API_URL}/escola-solicitacoes/pendentes-autorizacao-dieta/${uuid}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getDietaEspecialAutorizadasEscola = async (uuid, params) => {
  let url = `${API_URL}/escola-solicitacoes/autorizados-dieta/${uuid}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getDietaEspecialNegadasEscola = async (uuid, params) => {
  let url = `${API_URL}/escola-solicitacoes/negados-dieta/${uuid}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getDietaEspecialCanceladasEscola = async (uuid, params) => {
  let url = `${API_URL}/escola-solicitacoes/cancelados-dieta/${uuid}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getDietaEspecialAutorizadasTemporariamenteEscola = async (
  uuid,
  params,
) => {
  const url = `${API_URL}/escola-solicitacoes/autorizadas-temporariamente-dieta/${uuid}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getDietaEspecialAguardandoVigenciaEscola = async (
  uuid,
  params,
) => {
  const url = `${API_URL}/escola-solicitacoes/aguardando-vigencia-dieta/${uuid}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getDietaEspecialInativasTemporariamenteEscola = async (
  uuid,
  params,
) => {
  const url = `${API_URL}/escola-solicitacoes/inativas-temporariamente-dieta/${uuid}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getDietaEspecialInativasEscola = async (uuid, params) => {
  const url = `${API_URL}/escola-solicitacoes/inativas-dieta/${uuid}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

// DRE
export const getDietaEspecialPendenteAutorizacaoDRE = async (uuid, params) => {
  const url = `${API_URL}/diretoria-regional-solicitacoes/pendentes-autorizacao-dieta/${uuid}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getDietaEspecialAutorizadasDRE = async (uuid, params) => {
  const url = `${API_URL}/diretoria-regional-solicitacoes/autorizados-dieta/${uuid}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getDietaEspecialNegadasDRE = async (uuid, params) => {
  const url = `${API_URL}/diretoria-regional-solicitacoes/negados-dieta/${uuid}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getDietaEspecialCanceladasDRE = async (uuid, params) => {
  const url = `${API_URL}/diretoria-regional-solicitacoes/cancelados-dieta/${uuid}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getDietaEspecialAutorizadasTemporariamenteDRE = async (
  uuid,
  params,
) => {
  const url = `${API_URL}/diretoria-regional-solicitacoes/autorizadas-temporariamente-dieta/${uuid}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getDietaEspecialInativasTemporariamenteDRE = async (
  uuid,
  params,
) => {
  const url = `${API_URL}/diretoria-regional-solicitacoes/inativas-temporariamente-dieta/${uuid}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getDietaEspecialInativasDRE = async (uuid, params) => {
  const url = `${API_URL}/diretoria-regional-solicitacoes/inativas-dieta/${uuid}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

// CODAE
export const getDietaEspecialPendenteAutorizacaoCODAE = async (_, params) => {
  const url = `${API_URL}/codae-solicitacoes/pendentes-autorizacao-dieta/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getDietaEspecialAutorizadasCODAE = async (_, params) => {
  const url = `${API_URL}/codae-solicitacoes/autorizados-dieta/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getDietaEspecialNegadasCODAE = async (_, params) => {
  const url = `${API_URL}/codae-solicitacoes/negados-dieta/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getDietaEspecialCanceladasCODAE = async (_, params) => {
  const url = `${API_URL}/codae-solicitacoes/cancelados-dieta/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getDietaEspecialAutorizadasTemporariamenteCODAE = async (
  _,
  params,
) => {
  const url = `${API_URL}/codae-solicitacoes/autorizadas-temporariamente-dieta/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getDietaEspecialInativasTemporariamenteCODAE = async (
  _,
  params,
) => {
  const url = `${API_URL}/codae-solicitacoes/inativas-temporariamente-dieta/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getDietaEspecialInativasCODAE = async (_, params) => {
  const url = `${API_URL}/codae-solicitacoes/inativas-dieta/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

// TERCEIRIZADA
export const getDietaEspecialPendenteAutorizacaoTerceirizada = async (
  uuid,
  params,
) => {
  const url = `${API_URL}/terceirizada-solicitacoes/pendentes-autorizacao-dieta/${uuid}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getDietaEspecialAutorizadasTerceirizada = async (uuid, params) => {
  const url = `${API_URL}/terceirizada-solicitacoes/autorizados-dieta/${uuid}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getDietaEspecialNegadasTerceirizada = async (uuid, params) => {
  const url = `${API_URL}/terceirizada-solicitacoes/negados-dieta/${uuid}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getDietaEspecialCanceladasTerceirizada = async (uuid, params) => {
  const url = `${API_URL}/terceirizada-solicitacoes/cancelados-dieta/${uuid}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getDietaEspecialAutorizadasTemporariamenteTerceirizada = async (
  uuid,
  params,
) => {
  const url = `${API_URL}/terceirizada-solicitacoes/autorizadas-temporariamente-dieta/${uuid}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getDietaEspecialInativasTemporariamenteTerceirizada = async (
  uuid,
  params,
) => {
  const url = `${API_URL}/terceirizada-solicitacoes/inativas-temporariamente-dieta/${uuid}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getDietaEspecialInativasTerceirizada = async (uuid, params) => {
  const url = `${API_URL}/terceirizada-solicitacoes/inativas-dieta/${uuid}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getDietaEspecialAguardandoVigenciaTerceirizada = async (
  uuid,
  params,
) => {
  const url = `${API_URL}/terceirizada-solicitacoes/aguardando-vigencia-dieta/${uuid}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getPaginacaoSolicitacoesDietaEspecial = (
  urlPaginacao,
  uuidInstituicao,
  offSet,
) => {
  const url = `${API_URL}/${urlPaginacao}/${uuidInstituicao}/?limit=10${
    offSet > 0 ? `&offset=${offSet}` : "/"
  }`;

  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET",
  };
  return fetch(url, OBJ_REQUEST)
    .then((result) => {
      return result.json();
    })
    .catch((error) => {
      return error;
    });
};

export const getPaginacaoSolicitacoesDietaEspecialCODAE = (
  urlPaginacao,
  offSet,
) => {
  const url = `${API_URL}/${urlPaginacao}/?limit=10${
    offSet > 0 ? `&offset=${offSet}` : ""
  }`;

  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET",
  };
  return fetch(url, OBJ_REQUEST)
    .then((result) => {
      return result.json();
    })
    .catch((error) => {
      return error;
    });
};
