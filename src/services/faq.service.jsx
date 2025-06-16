import axios from "./_base";
import { ENDPOINT } from "../constants/shared";

export const getFaq = async () => {
  return axios.get(
    `/${ENDPOINT.CATEGORIA_PERGUNTAS_FREQUENTES}/perguntas-por-categoria/`
  );
};
