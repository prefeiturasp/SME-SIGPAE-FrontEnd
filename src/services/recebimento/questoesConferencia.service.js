import axios from "../_base";
import { gerarParametrosConsulta } from "src/helpers/utilities";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { getMensagemDeErro } from "src/helpers/statusErrors";
export const listarQuestoesConferencia = async () => {
  try {
    return await axios.get("/questoes-conferencia/");
  } catch (error) {
    toastError(getMensagemDeErro(error.response.status));
  }
};
export const listarQuestoesConferenciaSimples = async () => {
  try {
    return await axios.get("/questoes-conferencia/lista-simples-questoes/");
  } catch (error) {
    toastError(getMensagemDeErro(error.response.status));
  }
};
export const listarQuestoesPorProduto = async (params) => {
  try {
    return await axios.get("/questoes-por-produto/", { params });
  } catch (error) {
    toastError(getMensagemDeErro(error.response.status));
  }
};
export const detalharQuestoesPorProduto = async (uuid) => {
  try {
    return await axios.get(`/questoes-por-produto/${uuid}/`);
  } catch (error) {
    toastError(getMensagemDeErro(error.response.status));
  }
};
export const atribuirQuestoesPorProduto = async (payload) => {
  try {
    return await axios.post("/questoes-por-produto/", payload);
  } catch (error) {
    toastError(getMensagemDeErro(error.response.status));
  }
};
export const editarAtribuicaoQuestoesPorProduto = async (uuid, payload) => {
  try {
    return await axios.patch(`/questoes-por-produto/${uuid}/`, payload);
  } catch (error) {
    toastError(getMensagemDeErro(error.response.status));
  }
};
export const detalharQuestoesPorCronograma = async (uuid) => {
  try {
    const params = gerarParametrosConsulta({
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
