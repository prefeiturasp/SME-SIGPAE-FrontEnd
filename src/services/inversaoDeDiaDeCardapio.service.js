import axios from "./_base";
import { API_URL } from "../constants/config";
import { FLUXO } from "./constants";
import { ErrorHandlerFunction } from "./service-helpers";

export const getInversoesDeDiaDeCardapio = async () => {
  const url = `${API_URL}/inversoes-dia-cardapio/minhas-solicitacoes/`;
  const response = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const criarInversaoDeDiaDeCardapio = async (payload) => {
  const url = `${API_URL}/inversoes-dia-cardapio/`;
  const response = await axios.post(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const atualizarInversaoDeDiaDeCardapio = async (uuid, payload) => {
  const url = `${API_URL}/inversoes-dia-cardapio/${uuid}/`;
  const response = await axios.put(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getInversaoDeDiaDeCardapio = async (uuid) => {
  const url = `${API_URL}/inversoes-dia-cardapio/${uuid}/`;
  const response = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const removerInversaoDeDiaDeCardapio = async (uuid) => {
  const url = `${API_URL}/inversoes-dia-cardapio/${uuid}/`;
  const response = await axios.delete(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const inicioPedido = async (uuid) => {
  const url = `${API_URL}/inversoes-dia-cardapio/${uuid}/inicio-pedido/`;
  const response = await axios.patch(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const dreValidaPedidoEscola = async (uuid) => {
  const url = `${API_URL}/inversoes-dia-cardapio/${uuid}/diretoria-regional-valida-pedido/`;
  const response = await axios.patch(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const DRENegaInversaoDeDiaDeCardapio = async (uuid, payload) => {
  const url = `${API_URL}/inversoes-dia-cardapio/${uuid}/${FLUXO.DRE_NAO_VALIDA}/`;
  const response = await axios.patch(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const CODAEAutorizaPedidoDRE = async (uuid, payload) => {
  const url = `${API_URL}/inversoes-dia-cardapio/${uuid}/${FLUXO.CODAE_AUTORIZA}/`;
  const response = await axios.patch(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const CODAENegaInversaoDeDiaDeCardapio = async (uuid, payload) => {
  const url = `${API_URL}/inversoes-dia-cardapio/${uuid}/${FLUXO.CODAE_NEGA}/`;
  const response = await axios.patch(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const CODAEQuestionaInversaoDeDiaDeCardapio = async (uuid, payload) => {
  const url = `${API_URL}/inversoes-dia-cardapio/${uuid}/${FLUXO.CODAE_QUESTIONA}/`;
  const response = await axios.patch(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const TerceirizadaRespondeQuestionamentoInversaoDeDiaDeCardapio = async (
  uuid,
  payload
) => {
  const url = `${API_URL}/inversoes-dia-cardapio/${uuid}/${FLUXO.TERCEIRIZADA_RESPONDE_QUESTIONAMENTO}/`;
  const response = await axios.patch(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const terceirizadaTomaCiencia = async (uuid) => {
  const url = `${API_URL}/inversoes-dia-cardapio/${uuid}/terceirizada-toma-ciencia/`;
  const response = await axios.patch(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getDREPedidosDeInversoes = async (
  filtroAplicado,
  paramsFromPrevPage
) => {
  const url = `${API_URL}/inversoes-dia-cardapio/pedidos-diretoria-regional/${filtroAplicado}/`;
  const response = await axios.get(url, { params: paramsFromPrevPage });
  const results = response.data.results;
  const status = response.status;
  return { results: results, status };
};

export const getCODAEPedidosDeInversoes = async (
  filtroAplicado,
  paramsFromPrevPage
) => {
  const url = `${API_URL}/inversoes-dia-cardapio/pedidos-codae/${filtroAplicado}/`;
  const response = await axios.get(url, { params: paramsFromPrevPage });
  return response.data;
};

export const getTerceirizadaPedidosDeInversoes = async (filtroAplicado) => {
  const url = `${API_URL}/inversoes-dia-cardapio/pedidos-terceirizadas/${filtroAplicado}/`;
  const response = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const escolaCancelaInversaoDiaCardapio = async (uuid, justificativa) => {
  const url = `${API_URL}/inversoes-dia-cardapio/${uuid}/${FLUXO.ESCOLA_CANCELA}/`;
  const response = await axios
    .patch(url, { justificativa })
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
