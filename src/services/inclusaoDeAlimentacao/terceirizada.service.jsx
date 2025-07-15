import { FLUXO } from "src/services/constants";
import axios from "../_base";
import { ErrorHandlerFunction } from "../service-helpers";
import { getPath } from "./helper";

export const terceirizadaDarCienciaDeInclusaoDeAlimentacao = async (
  uuid,
  tipoSolicitacao
) => {
  const url = `${getPath(tipoSolicitacao)}/${uuid}/${
    FLUXO.TERCEIRIZADA_TOMA_CIENCIA
  }/`;
  const response = await axios.patch(url).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const terceirizadaResponderQuestionamentoDeInclusaoDeAlimentacao =
  async (uuid, payload, tipoSolicitacao) => {
    const url = `${getPath(tipoSolicitacao)}/${uuid}/${
      FLUXO.TERCEIRIZADA_RESPONDE_QUESTIONAMENTO
    }/`;
    const response = await axios
      .patch(url, payload)
      .catch(ErrorHandlerFunction);
    if (response) {
      const data = { data: response.data, status: response.status };
      return data;
    }
  };
