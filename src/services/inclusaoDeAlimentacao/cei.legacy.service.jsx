import { ErrorHandlerFunction } from "src/services/service-helpers";
import { ENDPOINT } from "../../constants/shared";
import axios from "../_base";
import { PEDIDOS } from "../constants";

/*
    TODO: A funcionalidade provida por esse arquivo 
    será migrada para services integrados que aceitam input
    de qualquer tipo (CEI ou nao-CEI)
*/

const { QUANTIDADE_ALUNOS_POR_PERIODO, INCLUSOES_ALIMENTACAO_DA_CEI } =
  ENDPOINT;

export const getInclusaoDeAlimentacaoDaCei = async (uuid) => {
  // shared
  const response = await axios.get(`${INCLUSOES_ALIMENTACAO_DA_CEI}/${uuid}/`);
  return response.data;
};

export const getDREPedidosDeInclusaoAlimentacaoDaCei = async (
  filtroAplicado
) => {
  // dre
  const url = `${INCLUSOES_ALIMENTACAO_DA_CEI}/${PEDIDOS.DRE}/${filtroAplicado}/`;
  const response = await axios.get(url);
  const results = response.data.results;
  return {
    results: results.map((el) => ({
      ...el,
      isCei: true,
    })),
    status: response.status,
  };
};

export const meusRascunhosDeInclusaoDeAlimentacao = async () => {
  // escola
  const response = await axios
    .get(`/${INCLUSOES_ALIMENTACAO_DA_CEI}/minhas-solicitacoes/`)
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getQuantidadeAlunosFaixaEtaria = async (
  // escola
  uuid,
  data_referencia_str
) => {
  const response = await axios
    .get(
      `/${QUANTIDADE_ALUNOS_POR_PERIODO}/${uuid}/alunos-por-faixa-etaria/${data_referencia_str}/`
    )
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getQuantidadeAlunosPeriodoEscolar = async (uuidEscola) => {
  // escola
  const response = await axios
    .get(`/${QUANTIDADE_ALUNOS_POR_PERIODO}/escola/${uuidEscola}/`)
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const criarInclusoesDaCEI = async (payload) => {
  // escola
  const response = await axios
    .post(`/${INCLUSOES_ALIMENTACAO_DA_CEI}/`, payload)
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const excluirInclusoesDaCei = async (uuid) => {
  // escola
  const response = await axios
    .delete(`/${INCLUSOES_ALIMENTACAO_DA_CEI}/${uuid}/`)
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const atualizarInclusoesDaCEI = async (payload, uuid) => {
  // escola
  const response = await axios
    .put(`/${INCLUSOES_ALIMENTACAO_DA_CEI}/${uuid}/`, payload)
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const iniciarInclusoesDaCEI = async (uuid) => {
  // escola
  const response = await axios
    .patch(`/${INCLUSOES_ALIMENTACAO_DA_CEI}/${uuid}/inicio-pedido/`)
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const minhasFaixasEtarias = async () => {
  const response = await axios
    .get(`/faixas-etarias/`)
    .catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
