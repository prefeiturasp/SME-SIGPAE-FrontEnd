import axios from "./_base";
import { ENDPOINT } from "../constants/shared";

export const getFaq = async () => {
  return axios.get(
    `/${ENDPOINT.CATEGORIA_PERGUNTAS_FREQUENTES}/perguntas-por-categoria/`,
  );
};

export const criarCategoriaFaq = async (data) => {
  return axios.post(`/${ENDPOINT.CATEGORIA_PERGUNTAS_FREQUENTES}/`, data);
};

export const criarPerguntaFrequente = async (dados) => {
  return axios.post(`/${ENDPOINT.PERGUNTAS_FREQUENTES}/`, dados);
};

export const listarPerguntasFrequentes = async (parametros) => {
  return axios.get(`/${ENDPOINT.PERGUNTAS_FREQUENTES}/`, {
    params: parametros,
  });
};

export const buscarPerguntaFrequente = async (uuid) => {
  return axios.get(`/${ENDPOINT.PERGUNTAS_FREQUENTES}/${uuid}/`);
};

export const atualizarPerguntaFrequente = async (uuid, dados) => {
  return axios.patch(`/${ENDPOINT.PERGUNTAS_FREQUENTES}/${uuid}/`, dados);
};

export const buscarCategoriasFaq = async (parametros) => {
  return axios.get(`/${ENDPOINT.CATEGORIA_PERGUNTAS_FREQUENTES}/`, {
    params: parametros,
  });
};

export const buscarOpcoesCategoriasFaq = async () => {
  return axios.get(`/${ENDPOINT.CATEGORIA_PERGUNTAS_FREQUENTES}/opcoes/`);
};

export const buscarCategoriaFaq = async (uuid) => {
  return axios.get(`/${ENDPOINT.CATEGORIA_PERGUNTAS_FREQUENTES}/${uuid}/`);
};

export const atualizarCategoriaFaq = async (uuid, dados) => {
  return axios.patch(
    `/${ENDPOINT.CATEGORIA_PERGUNTAS_FREQUENTES}/${uuid}/`,
    dados,
  );
};

export const excluirCategoriaFaq = async (uuid) => {
  return axios.delete(`/${ENDPOINT.CATEGORIA_PERGUNTAS_FREQUENTES}/${uuid}/`);
};

export const excluirPerguntaFrequente = async (uuid) => {
  return axios.delete(`/${ENDPOINT.PERGUNTAS_FREQUENTES}/${uuid}/`);
};
