import axios from "./_base";
import { saveAs } from "file-saver";
import { ENVIRONMENT } from "src/constants/config";
import HTTP_STATUS from "http-status-codes";

export const getDownloads = async (params) =>
  (await axios.get("/downloads/", { params })).data;

export const setDownloadMarcarDesmarcarLida = async (payload) =>
  await axios.put("/downloads/marcar-visto/", payload);

export const getQtdNaoVistos = async (params) =>
  (await axios.get("/downloads/quantidade-nao-vistos/", { params })).data;

export const deletarDownload = async (uuid) =>
  await axios.delete(`/downloads/${uuid}/`);

export const baixarArquivoCentral = async (download) => {
  let url = download.arquivo;
  if (["production", "homolog", "treinamento"].includes(ENVIRONMENT))
    url = url.replace("http://", "https://");
  const response = await axios.get(url, {
    responseType: "blob",
  });
  if (response.status !== HTTP_STATUS.OK) {
    throw new Error("Erro ao baixar PDF.");
  } else {
    const { data } = response;
    saveAs(data, download.identificador);
  }
};
