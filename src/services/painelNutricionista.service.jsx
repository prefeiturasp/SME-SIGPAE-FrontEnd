import { API_URL } from "../constants/config";
import { AUTH_TOKEN, SOLICITACOES, SOLICITACOES_DIETA } from "./constants";
import { ErrorHandlerFunction } from "./service-helpers";
import axios from "./_base";

const TODAS_SOLICITACOES_NUTRISUPERVISAO_URL = `${API_URL}/nutrisupervisao-solicitacoes`;
const SOLICITACOES_NUTRIMANIFESTACAO_URL = `${API_URL}/nutrimanifestacao-solicitacoes`;

// TODO: colocar essa função num arquivo separado, está sendo copiada/colada
const retornoBase = async (url) => {
  const OBJ_REQUEST = {
    headers: AUTH_TOKEN,
    method: "GET",
  };
  try {
    const result = await fetch(url, OBJ_REQUEST);
    const status = result.status;
    const json = await result.json();
    if (json.results) {
      return { results: json.results, status };
    }
    return { results: json, status };
  } catch (error) {
    console.log(error);
  }
};

export const getSolicitacaoDietaEspecial = async (uuid) => {
  const url = `${SOLICITACOES_DIETA}/${uuid}/`;
  return retornoBase(url);
};

export const getSolicitacoesPendentesNutricionista = async () => {
  const url = `${SOLICITACOES_DIETA}/${SOLICITACOES.PENDENTES}/`;
  return retornoBase(url);
};

export const getSolicitacoesAutorizadasNutricionista = async () => {
  const url = `${SOLICITACOES_DIETA}/${SOLICITACOES.AUTORIZADOS}/`;
  return retornoBase(url);
};

export const getSolicitacoesNegadasNutricionista = async () => {
  const url = `${SOLICITACOES_DIETA}/${SOLICITACOES.NEGADOS}/`;
  return retornoBase(url);
};

export const getTiposDietaEspecial = async () => {
  const url = `${API_URL}/tipos-dieta-especial/`;
  return retornoBase(url);
};

export const getMotivosNegacaoDietaEspecial = async () => {
  const url = `${API_URL}/motivos-negacao/?processo=INCLUSAO`;
  return retornoBase(url);
};

export const getSolicitacoesAutorizadasNutrisupervisao = async (params) => {
  const url = `${TODAS_SOLICITACOES_NUTRISUPERVISAO_URL}/${SOLICITACOES.AUTORIZADOS}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getSolicitacoesCanceladasNutrisupervisao = async (params) => {
  const url = `${TODAS_SOLICITACOES_NUTRISUPERVISAO_URL}/${SOLICITACOES.CANCELADOS}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getSolicitacoesNegadasNutrisupervisao = async (params) => {
  const url = `${TODAS_SOLICITACOES_NUTRISUPERVISAO_URL}/${SOLICITACOES.NEGADOS}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getSolicitacoesPendentesAutorizacaoNutrisupervisao = async (
  filtro
) => {
  const url = `${TODAS_SOLICITACOES_NUTRISUPERVISAO_URL}/${SOLICITACOES.PENDENTES}/${filtro}/`;

  const OBJ_REQUEST = {
    headers: AUTH_TOKEN,
    method: "GET",
  };
  try {
    const result = await fetch(url, OBJ_REQUEST);
    const json = await result.json();
    return json.results;
  } catch (error) {
    console.log(error);
  }
};

export const getSolicitacoesPendentesAutorizacaoNutrisupervisaoSecaoPendencias =
  async (filtroAplicado, tipoVisao) => {
    const url = `${TODAS_SOLICITACOES_NUTRISUPERVISAO_URL}/${SOLICITACOES.PENDENTES}/${filtroAplicado}/${tipoVisao}/`;
    const OBJ_REQUEST = {
      headers: AUTH_TOKEN,
      method: "GET",
    };
    try {
      const result = await fetch(url, OBJ_REQUEST);
      const json = await result.json();
      return json.results;
    } catch (error) {
      console.log(error);
    }
  };

export const getSolicitacoesComQuestionamentoNutrisupervisao = async (
  params
) => {
  const url = `${TODAS_SOLICITACOES_NUTRISUPERVISAO_URL}/${SOLICITACOES.QUESTIONAMENTOS}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getSolicitacoesPendentesAutorizacaoNutrisupervisaoSemFiltro =
  async (params) => {
    const url = `${TODAS_SOLICITACOES_NUTRISUPERVISAO_URL}/${SOLICITACOES.PENDENTES}/`;
    const response = await axios
      .get(url, { params })
      .catch(ErrorHandlerFunction);
    if (response) {
      const data = { data: response.data, status: response.status };
      return data;
    }
  };

export const getSolicitacoesAutorizadasNutrimanifestacao = async (params) => {
  const url = `${SOLICITACOES_NUTRIMANIFESTACAO_URL}/${SOLICITACOES.AUTORIZADOS}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getSolicitacoesCanceladasNutrimanifestacao = async (params) => {
  const url = `${SOLICITACOES_NUTRIMANIFESTACAO_URL}/${SOLICITACOES.CANCELADOS}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getSolicitacoesNegadasNutrimanifestacao = async (params) => {
  const url = `${SOLICITACOES_NUTRIMANIFESTACAO_URL}/${SOLICITACOES.NEGADOS}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const buscaAnosComDietas = async () => {
  const url = `${TODAS_SOLICITACOES_NUTRISUPERVISAO_URL}/${SOLICITACOES.ANOS_COM_DIETAS}/`;
  const response = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    return response.data;
  }
};

export const buscaTotaisRelatorioGerencialDietas = async (params) => {
  const url = `${TODAS_SOLICITACOES_NUTRISUPERVISAO_URL}/${SOLICITACOES.TOTAIS_GERENCIAL_DIETAS}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    return response.data;
  }
};
