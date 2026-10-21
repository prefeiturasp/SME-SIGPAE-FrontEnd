import axios from "src/services/_base";

export const cadastrarEscolaAberta = async (payload: any) =>
  await axios.post("/escola-aberta/", payload);

export const getEscolaAberta = async (uuid: string) =>
  await axios.get(`/escola-aberta/${uuid}/`);

export const atualizarEscolaAberta = (uuid: string, payload: any) =>
  axios.put(`/escola-aberta/${uuid}/`, payload); // ou patch
