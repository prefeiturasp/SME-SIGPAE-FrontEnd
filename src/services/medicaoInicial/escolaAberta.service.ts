import axios from "src/services/_base";
import { ErrorHandlerFunction } from "src/services/service-helpers";

type EscolaAbertaPorEscolaParams = {
  escola_uuid: string;
  mes: string;
  ano: string;
};

export const getEscolaAbertaPorMesAno = async (
  params: EscolaAbertaPorEscolaParams,
) => {
  const url = "escola-aberta/por-escola/";
  const response: any = await axios
    .get(url, { params })
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
