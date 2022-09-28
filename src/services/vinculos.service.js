import axios from "./_base";

export const getVinculosAtivos = async params =>
  (await axios.get("/vinculos/vinculos-ativos/", { params })).data;

export const getSubdivisoesCodae = async params =>
  (await axios.get("/codae/", { params })).data;

export const cadastrarVinculo = async payload =>
  await axios.post("/cadastro-com-coresso/", payload);

export const editarVinculo = async payload =>
  await axios.patch(
    `/cadastro-com-coresso/${payload.username}/alterar-email/`,
    payload
  );

export const finalizarVinculo = async username =>
  await axios.post(`/cadastro-com-coresso/${username}/finalizar-vinculo/`);
