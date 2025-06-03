import axios from "../_base";
import { ErrorHandlerFunction } from "src/services/service-helpers";
export const getPermissoesLancamentosEspeciais = async (params = null) => {
  const url = "medicao-inicial/permissao-lancamentos-especiais/";
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
export const getEscolasComPermissoesLancamentosEspeciais = async () => {
  const url =
    "medicao-inicial/permissao-lancamentos-especiais/escolas-permissoes-lancamentos-especiais/";
  const response = await axios.get(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
export const getPermissoesLancamentosEspeciaisMesAnoPorPeriodo = async (
  params
) => {
  const url =
    "medicao-inicial/permissao-lancamentos-especiais/permissoes-lancamentos-especiais-mes-ano-por-periodo/";
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
export const getPeriodosPermissoesLancamentosEspeciaisMesAno = async (
  params
) => {
  const url =
    "medicao-inicial/permissao-lancamentos-especiais/periodos-permissoes-lancamentos-especiais-mes-ano/";
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
