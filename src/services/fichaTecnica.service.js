import { ErrorHandlerFunction } from "./service-helpers";
import axios from "./_base";
import { getMensagemDeErro } from "../helpers/statusErrors";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { saveAs } from "file-saver";
export const cadastraRascunhoFichaTecnica = async (payload) =>
  await axios.post("/rascunho-ficha-tecnica/", payload);
export const editaRascunhoFichaTecnica = async (payload, uuid) =>
  await axios.put(`/rascunho-ficha-tecnica/${uuid}/`, payload);
export const getFichaTecnica = async (uuid) =>
  await axios.get(`/ficha-tecnica/${uuid}/`);
export const getFichaTecnicaComAnalise = async (uuid) =>
  await axios.get(`/ficha-tecnica/${uuid}/detalhar-com-analise/`);
export const listarFichastecnicas = async (params) =>
  await axios.get("/ficha-tecnica/", { params });
export const cadastrarFichaTecnica = async (payload) =>
  await axios.post("/ficha-tecnica/", payload, {
    skipAuthRefresh: true,
  });
export const cadastrarFichaTecnicaDoRascunho = async (payload, uuid) =>
  await axios.put(`/ficha-tecnica/${uuid}/`, payload, {
    skipAuthRefresh: true,
  });
// Service retorna vários status diferente dentro dos resultados, filtros são apenas strings
export const getDashboardFichasTecnicas = async (params = null) => {
  const url = `/ficha-tecnica/dashboard/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
// Service retorna apenas um status nos resultados, filtros em formatos de array são transformados em parametros de URL
export const getDashboardFichasTecnicasPorStatus = async (params = null) => {
  try {
    return await axios.get(`/ficha-tecnica/dashboard/`, { params });
  } catch (error) {
    toastError(getMensagemDeErro(error.response.status));
  }
};
export const getListaFichasTecnicasSimples = async () => {
  try {
    return await axios.get(`/ficha-tecnica/lista-simples/`);
  } catch (error) {
    toastError(getMensagemDeErro(error.response.status));
  }
};
export const getListaFichasTecnicasSimplesAprovadas = async () => {
  try {
    return await axios.get(`/ficha-tecnica/lista-simples-aprovadas/`);
  } catch (error) {
    toastError(getMensagemDeErro(error.response.status));
  }
};
export const getListaFichasTecnicasSimplesSemCronograma = async () => {
  try {
    return await axios.get(`/ficha-tecnica/lista-simples-sem-cronograma/`);
  } catch (error) {
    toastError(getMensagemDeErro(error.response.status));
  }
};
export const getListaFichasTecnicasSimplesSemLayoutEmbalagem = async () => {
  try {
    return await axios.get(
      `/ficha-tecnica/lista-simples-sem-layout-embalagem/`
    );
  } catch (error) {
    toastError(getMensagemDeErro(error.response.status));
  }
};
export const getListaFichasTecnicasSimplesSemQuestoesConferencia = async () => {
  try {
    return await axios.get(
      `/ficha-tecnica/lista-simples-sem-questoes-conferencia/`
    );
  } catch (error) {
    toastError(getMensagemDeErro(error.response.status));
  }
};
export const getDadosCronogramaFichaTecnica = async (uuid) =>
  await axios.get(`/ficha-tecnica/${uuid}/dados-cronograma/`);
export const cadastraRascunhoAnaliseFichaTecnica = async (payload, uuid) =>
  await axios.post(`/ficha-tecnica/${uuid}/rascunho-analise-gpcodae/`, payload);
export const editaRascunhoAnaliseFichaTecnica = async (payload, uuid) =>
  await axios.put(`/ficha-tecnica/${uuid}/rascunho-analise-gpcodae/`, payload);
export const cadastraAnaliseFichaTecnica = async (payload, uuid) =>
  await axios.post(`/ficha-tecnica/${uuid}/analise-gpcodae/`, payload);
export const corrigirFichaTecnica = async (payload, uuid) =>
  await axios.patch(`/ficha-tecnica/${uuid}/correcao-fornecedor/`, payload, {
    skipAuthRefresh: true,
  });
export const atualizarFichaTecnica = async (payload, uuid) =>
  await axios.patch(`/ficha-tecnica/${uuid}/atualizacao-fornecedor/`, payload, {
    skipAuthRefresh: true,
  });
export const imprimirFichaTecnica = async (uuid, numero) => {
  const url = `/ficha-tecnica/${uuid}/gerar-pdf-ficha/`;
  const { data } = await axios.get(url, { responseType: "blob" });
  saveAs(data, "ficha_tecnica_" + numero + ".pdf");
};
