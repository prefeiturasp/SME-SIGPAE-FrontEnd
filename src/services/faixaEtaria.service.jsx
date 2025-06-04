import axios from "./_base";

import { ENDPOINT } from "../constants/shared";

export const criarFaixasEtarias = async (
  faixas_etarias_ativadas,
  justificativa
) => {
  return await axios.post(`/${ENDPOINT.FAIXAS_ETARIAS}/`, {
    faixas_etarias_ativadas,
    justificativa,
  });
};

export const getFaixasEtarias = async () => {
  return await axios.get(`/${ENDPOINT.FAIXAS_ETARIAS}/`);
};
