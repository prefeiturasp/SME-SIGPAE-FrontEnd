import axios from "../_base";
export const getContratosVigentes = async () => {
  return await axios.get("/vigencias/contratos-vigentes/");
};
export const cadastraEmpenho = async (payload) => {
  return await axios.post("/medicao-inicial/empenhos/", payload);
};
export const getEmpenhos = async (page, filtros) => {
  let url = "/medicao-inicial/empenhos/";
  const params = { page, ...filtros };
  return await axios.get(url, { params });
};
export const getEmpenho = async (uuid) => {
  return await axios.get(`/medicao-inicial/empenhos/${uuid}/`);
};
export const editaEmpenho = async (uuid, payload) => {
  return await axios.patch(`/medicao-inicial/empenhos/${uuid}/`, payload);
};
