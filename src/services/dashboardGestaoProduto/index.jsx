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
