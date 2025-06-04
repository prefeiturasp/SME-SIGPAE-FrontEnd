import { API_URL } from "../constants/config";
import { SOLICITACOES } from "./constants";
import { ErrorHandlerFunction } from "./service-helpers";
import axios from "./_base";

const SOLICITACOES_ESCOLA = `${API_URL}/escola-solicitacoes`;

export const getSolicitacoesPendentesEscola = async (params) => {
  const url = `${SOLICITACOES_ESCOLA}/${SOLICITACOES.PENDENTES}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getSolicitacoesAutorizadasEscola = async (params) => {
  const url = `${SOLICITACOES_ESCOLA}/${SOLICITACOES.AUTORIZADOS}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getSolicitacoesNegadasEscola = async (params) => {
  const url = `${SOLICITACOES_ESCOLA}/${SOLICITACOES.NEGADOS}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getSolicitacoesCanceladasEscola = async (params) => {
  const url = `${SOLICITACOES_ESCOLA}/${SOLICITACOES.CANCELADOS}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
