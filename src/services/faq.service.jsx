import axios from "./_base";
import { ENDPOINT } from "../constants/shared";

export const getFaq = async () => {
  return axios.get(
    `/${ENDPOINT.CATEGORIA_PERGUNTAS_FREQUENTES}/perguntas-por-categoria/`,
  );
};

export const createFaqCategory = async (data) => {
  return axios.post(`/${ENDPOINT.CATEGORIA_PERGUNTAS_FREQUENTES}/`, data);
};

export const buscarCategoriasFaq = async (parametros) => {
  return axios.get(`/${ENDPOINT.CATEGORIA_PERGUNTAS_FREQUENTES}/`, {
    params: parametros,
  });
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
