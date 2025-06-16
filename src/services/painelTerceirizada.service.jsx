import { API_URL } from "../constants/config";
import axios from "./_base";
import { SOLICITACOES } from "./constants";
import { ErrorHandlerFunction } from "./service-helpers";

const SOLICITACOES_TERCEIRIZADA = `${API_URL}/terceirizada-solicitacoes`;

export const getSolicitacoesPendentesTerceirizada = async (params) => {
  const url = `${SOLICITACOES_TERCEIRIZADA}/${SOLICITACOES.PENDENTES}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getSolicitacoesCanceladasTerceirizada = async (params) => {
  const url = `${SOLICITACOES_TERCEIRIZADA}/${SOLICITACOES.CANCELADOS}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getSolicitacoesAutorizadasTerceirizada = async (params) => {
  const url = `${SOLICITACOES_TERCEIRIZADA}/${SOLICITACOES.AUTORIZADOS}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getSolicitacoesNegadasTerceirizada = async (params) => {
  const url = `${SOLICITACOES_TERCEIRIZADA}/${SOLICITACOES.NEGADOS}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getSolicitacoesPendenteCienciaTerceirizada = async (
  TerceirizadaUuid,
  filtroAplicado,
  tipoVisao
) => {
  const url = `${SOLICITACOES_TERCEIRIZADA}/${SOLICITACOES.PENDENTES_CIENCIA}/${TerceirizadaUuid}/${filtroAplicado}/${tipoVisao}/`;
  const response = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getSolicitacoesComQuestionamento = async (params) => {
  const url = `${SOLICITACOES_TERCEIRIZADA}/${SOLICITACOES.QUESTIONAMENTOS}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
