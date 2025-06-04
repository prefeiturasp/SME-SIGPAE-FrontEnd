import { ErrorHandlerFunction } from "./service-helpers";

import axios from "./_base";

export const getVinculosAtivos = async (params) =>
  (await axios.get("/vinculos/vinculos-ativos/", { params })).data;

export const getSubdivisoesCodae = async (params) =>
  (await axios.get("/codae/", { params })).data;

export const cadastrarVinculo = async (payload) =>
  await axios
    .post("/cadastro-com-coresso/", payload)
    .catch(ErrorHandlerFunction);

export const alterarEmailCore = async (payload) =>
  await axios.patch(
    `/cadastro-com-coresso/${payload.username}/alterar-email/`,
    payload
  );

export const alterarVinculo = async (payload) =>
  await axios.patch(
    `/cadastro-com-coresso/${payload.username}/alterar-vinculo/`,
    payload
  );

export const finalizarVinculo = async (username) =>
  await axios.post(`/cadastro-com-coresso/${username}/finalizar-vinculo/`);

export const getVinculoEmpresa = async () =>
  (await axios.get("/vinculos/vinculo-empresa/")).data;
