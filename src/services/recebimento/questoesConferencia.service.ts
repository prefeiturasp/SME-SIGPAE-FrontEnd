import axios from "../_base";

import {
  PayloadAtribuirQuestoesPorProduto,
  PayloadEditarAtribuicaoQuestoesPorProduto,
  ResponseAtribuirQuestoesPorProduto,
  ResponseDetalharQuestoesPorCronograma,
  ResponseDetalharQuestoesPorProduto,
  ResponseListarQuestoesConferencia,
  ResponseListarQuestoesConferenciaSimples,
  ResponseListarQuestoesPorProduto,
} from "interfaces/recebimento.interface";
import { gerarParametrosConsulta } from "helpers/utilities";
import { toastError } from "components/Shareable/Toast/dialogs";
import { getMensagemDeErro } from "helpers/statusErrors";
import { URLSearchParams } from "url";

export const listarQuestoesConferencia =
  async (): Promise<ResponseListarQuestoesConferencia> => {
    try {
      return await axios.get("/questoes-conferencia/");
    } catch (error) {
      toastError(getMensagemDeErro(error.response.status));
    }
  };

export const listarQuestoesConferenciaSimples =
  async (): Promise<ResponseListarQuestoesConferenciaSimples> => {
    try {
      return await axios.get("/questoes-conferencia/lista-simples-questoes/");
    } catch (error) {
      toastError(getMensagemDeErro(error.response.status));
    }
  };

export const listarQuestoesPorProduto = async (
  params: URLSearchParams
): Promise<ResponseListarQuestoesPorProduto> => {
  try {
    console.log(params);
    return await axios.get("/questoes-por-produto/", { params });
  } catch (error) {
    toastError(getMensagemDeErro(error.response.status));
  }
};

export const detalharQuestoesPorProduto = async (
  uuid: string
): Promise<ResponseDetalharQuestoesPorProduto> => {
  try {
    return await axios.get(`/questoes-por-produto/${uuid}/`);
  } catch (error) {
    toastError(getMensagemDeErro(error.response.status));
  }
};

export const atribuirQuestoesPorProduto = async (
  payload: PayloadAtribuirQuestoesPorProduto
): Promise<ResponseAtribuirQuestoesPorProduto> => {
  try {
    return await axios.post("/questoes-por-produto/", payload);
  } catch (error) {
    toastError(getMensagemDeErro(error.response.status));
  }
};

export const editarAtribuicaoQuestoesPorProduto = async (
  uuid: string,
  payload: PayloadEditarAtribuicaoQuestoesPorProduto
): Promise<ResponseAtribuirQuestoesPorProduto> => {
  try {
    return await axios.patch(`/questoes-por-produto/${uuid}/`, payload);
  } catch (error) {
    toastError(getMensagemDeErro(error.response.status));
  }
};

export const detalharQuestoesPorCronograma = async (
  uuid: string
): Promise<ResponseDetalharQuestoesPorCronograma> => {
  try {
    const params: URLSearchParams = gerarParametrosConsulta({
      cronograma_uuid: uuid,
    });
    return await axios.get(`/questoes-por-produto/busca-questoes-cronograma/`, {
      params,
    });
  } catch (error) {
    console.log(error);
    toastError(getMensagemDeErro(error.response.status));
  }
};
