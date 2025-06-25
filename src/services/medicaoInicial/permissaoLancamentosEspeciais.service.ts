import {
  ResponseEscolasComPermissoesLancamentosEspeciaisInterface,
  ResponsePermissoesLancamentosEspeciaisInterface,
} from "src/interfaces/responses.interface";
import { ErrorHandlerFunction } from "src/services/service-helpers";
import axios from "../_base";

export const getPermissoesLancamentosEspeciais = async (
  params: { page?: number; escola__uuid?: string } = null
) => {
  const url = "medicao-inicial/permissao-lancamentos-especiais/";
  const response: ResponsePermissoesLancamentosEspeciaisInterface = await axios
    .get(url, { params })
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getEscolasComPermissoesLancamentosEspeciais = async () => {
  const url =
    "medicao-inicial/permissao-lancamentos-especiais/escolas-permissoes-lancamentos-especiais/";
  const response: ResponseEscolasComPermissoesLancamentosEspeciaisInterface =
    await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getPermissoesLancamentosEspeciaisMesAnoPorPeriodo = async (
  params: any
) => {
  const url =
    "medicao-inicial/permissao-lancamentos-especiais/permissoes-lancamentos-especiais-mes-ano-por-periodo/";
  const response: any = await axios
    .get(url, { params })
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getPeriodosPermissoesLancamentosEspeciaisMesAno = async (
  params: any
) => {
  const url =
    "medicao-inicial/permissao-lancamentos-especiais/periodos-permissoes-lancamentos-especiais-mes-ano/";
  const response: any = await axios
    .get(url, { params })
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
