import {
  AnaliseFichaTecnicaPayload,
  FichaTecnicaPayload,
} from "components/screens/PreRecebimento/FichaTecnica/interfaces";
import axios from "./_base";
import {
  ResponseDadosCronogramaFichaTecnica,
  ResponseFichaTecnicaDetalhada,
  ResponseFichaTecnicaDetalhadaComAnalise,
  ResponseFichasTecnicas,
  ResponseFichasTecnicasDashboard,
  ResponseFichasTecnicasPorStatusDashboard,
  ResponseFichasTecnicasSimples,
  ResponseSemDadosInterface,
} from "interfaces/responses.interface";
import { FiltrosDashboardFichasTecnicas } from "interfaces/pre_recebimento.interface";
import { getMensagemDeErro } from "../helpers/statusErrors";
import { toastError } from "components/Shareable/Toast/dialogs";
import { saveAs } from "file-saver";

export const cadastraRascunhoFichaTecnica = async (
  payload: FichaTecnicaPayload
): Promise<ResponseFichaTecnicaDetalhada> =>
  await axios.post("/rascunho-ficha-tecnica/", payload);

export const editaRascunhoFichaTecnica = async (
  payload: FichaTecnicaPayload,
  uuid: string
): Promise<ResponseFichaTecnicaDetalhada> =>
  await axios.put(`/rascunho-ficha-tecnica/${uuid}/`, payload);

export const getFichaTecnica = async (
  uuid: string
): Promise<ResponseFichaTecnicaDetalhada> =>
  await axios.get(`/ficha-tecnica/${uuid}/`);

export const getFichaTecnicaComAnalise = async (
  uuid: string
): Promise<ResponseFichaTecnicaDetalhadaComAnalise> =>
  await axios.get(`/ficha-tecnica/${uuid}/detalhar-com-analise/`);

export const listarFichastecnicas = async (
  params: URLSearchParams
): Promise<ResponseFichasTecnicas> =>
  await axios.get("/ficha-tecnica/", { params });

export const cadastrarFichaTecnica = async (
  payload: FichaTecnicaPayload
): Promise<ResponseFichaTecnicaDetalhada> =>
  await axios.post("/ficha-tecnica/", payload);

export const cadastrarFichaTecnicaDoRascunho = async (
  payload: FichaTecnicaPayload,
  uuid: string
): Promise<ResponseFichaTecnicaDetalhada> =>
  await axios.put(`/ficha-tecnica/${uuid}/`, payload);

// Service retorna vários status diferente dentro dos resultados, filtros são apenas strings
export const getDashboardFichasTecnicas = async (
  params: FiltrosDashboardFichasTecnicas = null
): Promise<ResponseFichasTecnicasDashboard> =>
  await axios.get(`/ficha-tecnica/dashboard/`, { params });

// Service retorna apenas um status nos resultados, filtros em formatos de array são transformados em parametros de URL
export const getDashboardFichasTecnicasPorStatus = async (
  params: URLSearchParams = null
): Promise<ResponseFichasTecnicasPorStatusDashboard> => {
  try {
    return await axios.get(`/ficha-tecnica/dashboard/`, { params });
  } catch (error) {
    toastError(getMensagemDeErro(error.response.status));
  }
};

export const getListaFichasTecnicasSimples =
  async (): Promise<ResponseFichasTecnicasSimples> => {
    try {
      return await axios.get(`/ficha-tecnica/lista-simples/`);
    } catch (error) {
      toastError(getMensagemDeErro(error.response.status));
    }
  };

export const getListaFichasTecnicasSimplesSemCronograma =
  async (): Promise<ResponseFichasTecnicasSimples> => {
    try {
      return await axios.get(`/ficha-tecnica/lista-simples-sem-cronograma/`);
    } catch (error) {
      toastError(getMensagemDeErro(error.response.status));
    }
  };

export const getListaFichasTecnicasSimplesSemLayoutEmbalagem =
  async (): Promise<ResponseFichasTecnicasSimples> => {
    try {
      return await axios.get(
        `/ficha-tecnica/lista-simples-sem-layout-embalagem/`
      );
    } catch (error) {
      toastError(getMensagemDeErro(error.response.status));
    }
  };

export const getDadosCronogramaFichaTecnica = async (
  uuid: string
): Promise<ResponseDadosCronogramaFichaTecnica> =>
  await axios.get(`/ficha-tecnica/${uuid}/dados-cronograma/`);

export const cadastraRascunhoAnaliseFichaTecnica = async (
  payload: AnaliseFichaTecnicaPayload,
  uuid: string
): Promise<ResponseFichaTecnicaDetalhadaComAnalise> =>
  await axios.post(`/ficha-tecnica/${uuid}/rascunho-analise-gpcodae/`, payload);

export const editaRascunhoAnaliseFichaTecnica = async (
  payload: AnaliseFichaTecnicaPayload,
  uuid: string
): Promise<ResponseFichaTecnicaDetalhadaComAnalise> =>
  await axios.put(`/ficha-tecnica/${uuid}/rascunho-analise-gpcodae/`, payload);

export const cadastraAnaliseFichaTecnica = async (
  payload: AnaliseFichaTecnicaPayload,
  uuid: string
): Promise<ResponseSemDadosInterface> =>
  await axios.post(`/ficha-tecnica/${uuid}/analise-gpcodae/`, payload);

export const corrigirFichaTecnica = async (
  payload: FichaTecnicaPayload,
  uuid: string
): Promise<ResponseSemDadosInterface> =>
  await axios.patch(`/ficha-tecnica/${uuid}/correcao-fornecedor/`, payload);

export const imprimirFichaTecnica = async (uuid: string, numero: string) => {
  const url = `/ficha-tecnica/${uuid}/gerar-pdf-ficha/`;
  const { data } = await axios.get(url, { responseType: "blob" });
  saveAs(data, "ficha_tecnica_" + numero + ".pdf");
};
