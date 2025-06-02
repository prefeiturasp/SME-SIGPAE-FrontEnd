import axios from "./_base";

export const getNotificacoes = async (params) =>
  await axios.get("/notificacoes/", { params });

export const getQtdNaoLidas = async () =>
  await axios.get("/notificacoes/quantidade-nao-lidos/");

export const getNotificacoesGerais = async (params) =>
  await axios.get("/notificacoes/gerais/", { params });

export const getPendenciasNaoResolvidas = async (params) =>
  await axios.get("/notificacoes/pendencias-nao-resolvidas/", { params });

export const setNotificacaoMarcarDesmarcarLida = async (payload) =>
  await axios.put("/notificacoes/marcar-lido/", payload);
