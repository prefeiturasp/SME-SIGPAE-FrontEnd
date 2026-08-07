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

export const buscarCategoriasFaq = async () => {
  return axios.get(`/${ENDPOINT.CATEGORIA_PERGUNTAS_FREQUENTES}/`);
};
