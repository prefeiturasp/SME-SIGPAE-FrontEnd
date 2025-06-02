import axios from "./_base";
import { saveAs } from "file-saver";
import { ErrorHandlerFunction } from "src/services/service-helpers";

export const baixarExcelModeloServidor = async () => {
  const url = `/planilha-coresso-servidor/download-planilha-servidor/`;
  const { data } = await axios.get(url, { responseType: "blob" });
  saveAs(data, "planilha_carga_usuario_servidor.xlsx");
};

export const baixarExcelModeloNaoServidor = async () => {
  const url = `/planilha-coresso-externo/download-planilha-nao-servidor/`;
  const { data } = await axios.get(url, { responseType: "blob" });
  saveAs(data, "planilha_carga_usuario_nao_servidor.xlsx");
};

export const baixarExcelModeloUEParceira = async () => {
  const url = `/planilha-coresso-ue-parceira/download-planilha-ue-parceira/`;
  const { data } = await axios.get(url, { responseType: "blob" });
  saveAs(data, "planilha_carga_usuarios_ues_parceiras.xlsx");
};

export const getPlanilhasServidor = async (params) =>
  (await axios.get("/planilha-coresso-servidor/", { params })).data;

export const getPlanilhasNaoServidor = async (params) =>
  (await axios.get("/planilha-coresso-externo/", { params })).data;

export const getPlanilhasUEParceira = async (params) =>
  (await axios.get("/planilha-coresso-ue-parceira/", { params })).data;

export const createExcelCoreSSOExterno = async (params) => {
  const url = `/planilha-coresso-externo/`;
  const headers = { "content-type": "multipart/form-data" };
  const formData = new FormData();
  formData.append("conteudo", params.conteudo);
  return await axios
    .post(url, formData, {
      headers: headers,
    })
    .catch(ErrorHandlerFunction);
};

export const createExcelCoreSSOServidor = async (params) => {
  const url = `/planilha-coresso-servidor/`;
  const headers = { "content-type": "multipart/form-data" };
  const formData = new FormData();
  formData.append("conteudo", params.conteudo);
  return await axios
    .post(url, formData, {
      headers: headers,
    })
    .catch(ErrorHandlerFunction);
};

export const createExcelCoreSSOUEParceira = async (params) => {
  const url = `/planilha-coresso-ue-parceira/`;
  const headers = { "content-type": "multipart/form-data" };
  const formData = new FormData();
  formData.append("conteudo", params.conteudo);
  return await axios
    .post(url, formData, {
      headers: headers,
    })
    .catch(ErrorHandlerFunction);
};

export const removerPlanilhaServidor = async (uuid) =>
  await axios.patch(`/planilha-coresso-servidor/${uuid}/remover/`);

export const removerPlanilhaExterno = async (uuid) =>
  await axios.patch(`/planilha-coresso-externo/${uuid}/remover/`);

export const removerPlanilhaUEParceira = async (uuid) =>
  await axios.patch(`/planilha-coresso-ue-parceira/${uuid}/remover/`);

export const executarCargaPlanilhaServidor = async (uuid) =>
  await axios.post(`/planilha-coresso-servidor/${uuid}/processar-importacao/`);

export const executarCargaPlanilhaExterno = async (uuid) =>
  await axios.post(`/planilha-coresso-externo/${uuid}/processar-importacao/`);

export const executarCargaPlanilhaUEParceira = async (uuid) =>
  await axios.post(
    `/planilha-coresso-ue-parceira/${uuid}/processar-importacao/`
  );
