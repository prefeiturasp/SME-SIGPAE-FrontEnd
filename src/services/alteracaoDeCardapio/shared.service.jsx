import { API_URL } from "src/constants/config";
import { ErrorHandlerFunction } from "src/services/service-helpers";
import axios from "../_base";
import { getPath } from "./helper";

export const getMotivosAlteracaoCardapio = async () => {
  const url = `${API_URL}/motivos-alteracao-cardapio/`;
  const response = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getAlteracaoCardapio = async (uuid, tipoSolicitacao) => {
  const url = `${getPath(tipoSolicitacao)}/${uuid}/`;
  const response = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
