import axios from "./_base";
import { saveAs } from "file-saver";
import { getMensagemDeErro } from "../helpers/statusErrors";
import { toastError } from "../components/Shareable/Toast/dialogs";
export const cadastraDocumentoRecebimento = async (payload) =>
  await axios.post("/documentos-de-recebimento/", payload);
export const detalharDocumentoRecebimento = async (uuid) => {
  try {
    return await axios.get(`/documentos-de-recebimento/${uuid}/`);
  } catch (error) {
    toastError(getMensagemDeErro(error.response.status));
  }
};
export const detalharDocumentoParaAnalise = async (uuid) => {
  try {
    return await axios.get(`/documentos-de-recebimento/${uuid}/`);
  } catch (error) {
    toastError(getMensagemDeErro(error.response.status));
  }
};
export const listarDocumentosRecebimento = async (params) => {
  try {
    return await axios.get("/documentos-de-recebimento/", { params });
  } catch (error) {
    toastError(getMensagemDeErro(error.response.status));
  }
};
// Service retorna vários status diferente dentro dos resultados, filtros são apenas strings
export const getDashboardDocumentosRecebimento = async (params = null) => {
  try {
    return await axios.get(`/documentos-de-recebimento/dashboard/`, { params });
  } catch (error) {
    toastError(getMensagemDeErro(error.response.status));
  }
};
// Service retorna apenas um status nos resultados, filtros em formatos de array são transformados em parametros de URL
export const getDashboardDocumentosRecebimentoPorStatus = async (
  params = null
) => {
  try {
    return await axios.get(`/documentos-de-recebimento/dashboard/`, { params });
  } catch (error) {
    toastError(getMensagemDeErro(error.response.status));
  }
};
export const analisaDocumentoRecebimentoRascunho = async (payload, uuid) =>
  await axios.patch(
    `/documentos-de-recebimento/${uuid}/analise-documentos-rascunho/`,
    payload
  );
export const analisaDocumentoRecebimento = async (payload, uuid) =>
  await axios.patch(
    `/documentos-de-recebimento/${uuid}/analise-documentos/`,
    payload
  );
export const corrigirDocumentoRecebimento = async (payload, uuid) =>
  await axios.patch(
    `/documentos-de-recebimento/${uuid}/corrigir-documentos/`,
    payload
  );
export const downloadArquivoLaudoAssinado = async (uuid, numero_cronograma) => {
  try {
    const { data } = await axios.get(
      `/documentos-de-recebimento/${uuid}/download-laudo-assinado/`,
      { responseType: "blob" }
    );
    saveAs(data, `laudo_cronograma_${numero_cronograma}.pdf`);
  } catch {
    toastError("Houve um erro ao baixar o arquivo de Laudo.");
  }
};
export const atualizarDocumentoRecebimento = async (payload, uuid) =>
  await axios.patch(
    `/documentos-de-recebimento/${uuid}/atualizar-documentos/`,
    payload
  );
