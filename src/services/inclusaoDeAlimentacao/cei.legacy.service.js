import axios from "../_base";
import { ENDPOINT } from "../../constants/shared";
import { PEDIDOS } from "../constants";
import { ErrorHandlerFunction } from "services/service-helpers";

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
  return await axios.get(
    `/${INCLUSOES_ALIMENTACAO_DA_CEI}/minhas-solicitacoes/`
  );
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
  return await axios.get(
    `/${QUANTIDADE_ALUNOS_POR_PERIODO}/escola/${uuidEscola}/`
  );
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
  return await axios.delete(`/${INCLUSOES_ALIMENTACAO_DA_CEI}/${uuid}/`);
};

export const atualizarInclusoesDaCEI = async (payload, uuid) => {
  // escola
  return await axios.put(`/${INCLUSOES_ALIMENTACAO_DA_CEI}/${uuid}/`, payload);
};

export const iniciarInclusoesDaCEI = async (uuid) => {
  // escola
  return await axios.patch(
    `/${INCLUSOES_ALIMENTACAO_DA_CEI}/${uuid}/inicio-pedido/`
  );
};

export const minhasFaixasEtarias = async () => {
  return await axios.get(`/faixas-etarias/`);
};
