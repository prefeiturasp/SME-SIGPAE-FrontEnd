import {
  ClausulaInterface,
  ClausulaPayload,
  FiltrosInterface,
  ResponseClausulasInterface,
} from "interfaces/clausulas_para_descontos.interface";
import axios from "../_base";

export const cadastraClausulaParaDesconto = async (
  payload: ClausulaPayload
) => {
  return await axios.post("/medicao-inicial/clausulas-de-descontos/", payload);
};

export const getClausulasParaDescontos = async (
  page: number,
  filtros: FiltrosInterface
) => {
  let url = "/medicao-inicial/clausulas-de-descontos/";
  const params = { page, ...filtros };

  return await axios.get<ResponseClausulasInterface>(url, { params });
};

export const getClausulaParaDesconto = async (uuid: string) => {
  return await axios.get<ClausulaInterface>(
    `/medicao-inicial/clausulas-de-descontos/${uuid}/`
  );
};

export const editaClausulaParaDesconto = async (
  uuid: string,
  payload: Partial<ClausulaPayload>
) => {
  return await axios.patch(
    `/medicao-inicial/clausulas-de-descontos/${uuid}/`,
    payload
  );
};
