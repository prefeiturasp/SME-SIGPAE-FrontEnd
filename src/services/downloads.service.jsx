import axios from "./_base";
import { saveAs } from "file-saver";
import { ENVIRONMENT } from "src/constants/config";

export const getDownloads = async (params) =>
  (await axios.get("/downloads/", { params })).data;

export const setDownloadMarcarDesmarcarLida = async (payload) =>
  await axios.put("/downloads/marcar-visto/", payload);

export const getQtdNaoVistos = async (params) =>
  (await axios.get("/downloads/quantidade-nao-vistos/", { params })).data;

export const deletarDownload = async (uuid) =>
  await axios.delete(`/downloads/${uuid}/`);

export const baixarArquivoCentral = async (download) => {
  let status = 0;
  let url = download.arquivo;
  if (["production", "homolog", "treinamento"].includes(ENVIRONMENT))
    url = url.replace("http://", "https://");
  return fetch(url, {
    method: "GET",
  })
    .then((res) => {
      status = res.status;
      return res.blob();
    })
    .then((data) => {
      saveAs(data, download.identificador);
      return { data: data, status: status };
    })
    .catch((error) => {
      return error.json();
    });
};
