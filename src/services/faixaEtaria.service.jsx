import axios from "./_base";

import { ENDPOINT } from "../constants/shared";
import { ErrorHandlerFunction } from "./service-helpers";

export const criarFaixasEtarias = async (
  faixas_etarias_ativadas,
  justificativa,
) => {
  return await axios.post(`/${ENDPOINT.FAIXAS_ETARIAS}/`, {
    faixas_etarias_ativadas,
    justificativa,
  });
};

export const getFaixasEtarias = async () => {
  const url = `/${ENDPOINT.FAIXAS_ETARIAS}/`;
  const response = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
