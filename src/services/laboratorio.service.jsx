import axios from "./_base";

export const getLaboratorio = async (uuid) =>
  await axios.get(`/laboratorios/${uuid}/`);

export const getLaboratorios = async (params) => {
  const url = `/laboratorios/`;
  return await axios.get(url, { params });
};

export const getListaLaboratorios = async () =>
  await axios.get("/laboratorios/lista-laboratorios/");

export const getListaLaboratoriosCredenciados = async () =>
  await axios.get("/laboratorios/lista-laboratorios-credenciados/");

export const cadastraLaboratorio = async (payload) =>
  await axios.post("/laboratorios/", payload);

export const editaLaboratorio = async (payload, uuid) =>
  await axios.put(`/laboratorios/${uuid}/`, payload);
