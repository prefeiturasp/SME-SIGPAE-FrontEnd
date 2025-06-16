import axios from "./_base";

export const getListaNomesTiposEmbalagens = async () =>
  await axios.get("/tipos-embalagens/lista-nomes-tipos-embalagens/");

export const getListaAbreviacoesTiposEmbalagens = async () =>
  await axios.get("/tipos-embalagens/lista-abreviacoes-tipos-embalagens/");

export const getListaTiposEmbalagens = async () =>
  await axios.get("/tipos-embalagens/lista-tipos-embalagens/");

export const getTiposEmbalagens = async (params) => {
  const url = `/tipos-embalagens/`;
  return await axios.get(url, { params });
};

export const getTipoEmbalagem = async (uuid) =>
  await axios.get(`/tipos-embalagens/${uuid}/`);

export const cadastraTipoEmbalagem = async (payload) =>
  await axios.post("/tipos-embalagens/", payload);

export const editaTipoEmbalagem = async (payload, uuid) =>
  await axios.put(`/tipos-embalagens/${uuid}/`, payload);

export const getUnidadesMedida = async (params) =>
  await axios.get("/unidades-medida-logistica/", { params });

export const getUnidadeMedida = async (uuid) =>
  await axios.get(`/unidades-medida-logistica/${uuid}/`);

export const cadastrarUnidadeMedida = async (payload) =>
  await axios.post("/unidades-medida-logistica/", payload);

export const editarUnidadeMedida = async (payload, uuid) =>
  await axios.patch(`/unidades-medida-logistica/${uuid}/`, payload);

export const getNomesEAbreviacoesUnidadesMedida = async () =>
  await axios.get("/unidades-medida-logistica/lista-nomes-abreviacoes/");
