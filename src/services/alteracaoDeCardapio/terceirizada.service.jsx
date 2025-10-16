import { FLUXO } from "src/services/constants";
import { ErrorHandlerFunction } from "src/services/service-helpers";
import axios from "../_base";
import { getPath } from "./helper";

export const TerceirizadaTomaCienciaAlteracaoCardapio = async (
  uuid,
  payload,
  tipoSolicitacao,
) => {
  const url = `${getPath(tipoSolicitacao)}/${uuid}/${
    FLUXO.TERCEIRIZADA_TOMA_CIENCIA
  }/`;
  const response = await axios.patch(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const terceirizadaRespondeQuestionamentoAlteracaoCardapio = async (
  uuid,
  payload,
  tipoSolicitacao,
) => {
  const url = `${getPath(tipoSolicitacao)}/${uuid}/${
    FLUXO.TERCEIRIZADA_RESPONDE_QUESTIONAMENTO
  }/`;
  const response = await axios.patch(url, payload).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
