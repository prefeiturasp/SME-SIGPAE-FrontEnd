import { ErrorHandlerFunction } from "../service-helpers";
import axios from "services/_base";

export const getProdutosPendenteHomologacao = async (params) => {
  const url = `/dashboard-produtos/pendente-homologacao/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getProdutosSuspensos = async (params) => {
  const url = `/dashboard-produtos/suspensos/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getProdutosHomologados = async (params) => {
  const url = `/dashboard-produtos/homologados/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getProdutosNaoHomologados = async (params) => {
  const url = `/dashboard-produtos/nao-homologados/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getProdutosAguardandoAnaliseReclamacao = async (params) => {
  const url = `/dashboard-produtos/aguardando-analise-reclamacao/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getProdutosCorrecaoDeProdutos = async (params) => {
  const url = `/dashboard-produtos/correcao-de-produtos/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getProdutosAguardandoAmostraAnaliseSensorial = async (params) => {
  const url = `/dashboard-produtos/aguardando-amostra-analise-sensorial/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getProdutosQuestionamentoDaCODAE = async (params) => {
  const url = `/dashboard-produtos/questionamento-da-codae/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
