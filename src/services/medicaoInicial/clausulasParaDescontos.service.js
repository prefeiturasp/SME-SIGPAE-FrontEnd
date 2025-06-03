import axios from "../_base";
export const cadastraClausulaParaDesconto = async (payload) => {
  return await axios.post("/medicao-inicial/clausulas-de-descontos/", payload);
};
export const getClausulasParaDescontos = async (page, filtros) => {
  let url = "/medicao-inicial/clausulas-de-descontos/";
  const params = { page, ...filtros };
  return await axios.get(url, { params });
};
export const getClausulaParaDesconto = async (uuid) => {
  return await axios.get(`/medicao-inicial/clausulas-de-descontos/${uuid}/`);
};
export const editaClausulaParaDesconto = async (uuid, payload) => {
  return await axios.patch(
    `/medicao-inicial/clausulas-de-descontos/${uuid}/`,
    payload
  );
};
export const deletaClausulaParaDesconto = async (uuid) => {
  return await axios.delete(`/medicao-inicial/clausulas-de-descontos/${uuid}/`);
};
