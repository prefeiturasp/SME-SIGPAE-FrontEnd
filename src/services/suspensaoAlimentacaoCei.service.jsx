import { ENDPOINT } from "../constants/shared";

import axios from "./_base";

export const escolaInformaSuspensao = async (uuid, payload) =>
  await axios.patch(`${ENDPOINT.INFORMA_SUSPENSAO_DA_CEI(uuid)}`, payload);

export const EscolaSalvaRascunhoDeSuspensao = async (payload) => {
  return await axios.post(
    `/${ENDPOINT.SUSPENSAO_ALIMENTACAO_DA_CEI}/`,
    payload
  );
};

export const EscolaBuscaRascunhos = async () => {
  return await axios.get(
    `/${ENDPOINT.SUSPENSAO_ALIMENTACAO_DA_CEI}/meus_rascunhos/`
  );
};

export const EscolaExcluiSuspensao = async ({ uuid }) => {
  return await axios.delete(
    `/${ENDPOINT.SUSPENSAO_ALIMENTACAO_DA_CEI}/${uuid}/`
  );
};

export const EscolaAtualizaSuspensao = async (uuid, payload) => {
  return await axios.patch(
    `/${ENDPOINT.SUSPENSAO_ALIMENTACAO_DA_CEI}/${uuid}/`,
    payload
  );
};

export const getSuspensaoAlimentacaoCEI = async (uuid) => {
  return await axios.get(`/${ENDPOINT.SUSPENSAO_ALIMENTACAO_DA_CEI}/${uuid}/`);
};

export const escolaCancelaSuspensaoCEI = async (uuid, payload) => {
  return await axios.patch(
    `/${ENDPOINT.SUSPENSAO_ALIMENTACAO_DA_CEI}/${uuid}/cancela-suspensao-cei/`,
    payload
  );
};
