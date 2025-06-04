import {
  filtraCiencia,
  filtraInformados,
  filtraNoLimite,
  filtraPrioritarios,
  filtraRegular,
} from "../helpers/painelPedidos";
import { API_URL } from "../constants/config";
import { codaeListarSolicitacoesDeAlteracaoDeCardapio } from "./alteracaoDeCardapio";
import authService from "./auth";
import { codaeListarSolicitacoesDeInclusaoDeAlimentacao } from "src/services/inclusaoDeAlimentacao";
import { getCODAEPedidosDeInversoes } from "src/services/inversaoDeDiaDeCardapio.service";
import { getCODAEPedidosKitLanchePendentes } from "src/services/kitLanche";
import { getCODAEPedidosSolicitacoesUnificadas } from "src/services/solicitacaoUnificada.service";
import { getSuspensaoDeAlimentacaoCODAE } from "src/services/suspensaoDeAlimentacao.service";
import { SOLICITACOES } from "./constants";
import { TIPO_SOLICITACAO } from "src/constants/shared";
import { safeConcatOn } from "src/helpers/utilities";
import { ErrorHandlerFunction } from "./service-helpers";
import axios from "./_base";

// TODO: isso pode ser simplificado, igual aos demais painel*.service, mas faltam testes

const authToken = {
  Authorization: `JWT ${authService.getToken()}`,
  "Content-Type": "application/json",
};

const TODAS_SOLICITACOES_CODAE_URL = `${API_URL}/codae-solicitacoes`;

export const getSolicitacoesAutorizadasCodae = async (params) => {
  const url = `${TODAS_SOLICITACOES_CODAE_URL}/${SOLICITACOES.AUTORIZADOS}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getSolicitacoesCanceladasCodae = async (params) => {
  const url = `${TODAS_SOLICITACOES_CODAE_URL}/${SOLICITACOES.CANCELADOS}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getSolicitacoesPendentesAutorizacaoCodae = async (filtro) => {
  const url = `${TODAS_SOLICITACOES_CODAE_URL}/${SOLICITACOES.PENDENTES}/${filtro}/`;

  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET",
  };
  try {
    const result = await fetch(url, OBJ_REQUEST);
    const json = await result.json();
    return json.results;
  } catch (error) {
    console.log(error);
  }
};

export const getSolicitacoesPendentesAutorizacaoCodaeSemFiltro = async (
  params
) => {
  const url = `${TODAS_SOLICITACOES_CODAE_URL}/${SOLICITACOES.PENDENTES}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
export const getSolicitacoesComQuestionamentoCodae = async (params) => {
  const url = `${TODAS_SOLICITACOES_CODAE_URL}/${SOLICITACOES.QUESTIONAMENTOS}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getSolicitacoesPendentesAutorizacaoCODAESecaoPendencias = async (
  filtroAplicado,
  tipoVisao,
  params
) => {
  const url = `${TODAS_SOLICITACOES_CODAE_URL}/${SOLICITACOES.PENDENTES}/${filtroAplicado}/${tipoVisao}/`;

  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);

  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getSolicitacoesNegadasCodae = async (params) => {
  const url = `${TODAS_SOLICITACOES_CODAE_URL}/${SOLICITACOES.NEGADOS}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getResumoPendenciasInversoesCardapio = async (
  filtro = "sem_filtro"
) => {
  let resposta = {
    total: 0,
    prioritario: 0,
    limite: 0,
    regular: 0,
  };

  let pedidosPrioritarios = [];
  let pedidosLimite = [];
  let pedidosRegular = [];

  const solicitacoes = await getCODAEPedidosDeInversoes(filtro);

  if (solicitacoes) {
    pedidosPrioritarios = filtraPrioritarios(solicitacoes.results);
    pedidosLimite = filtraNoLimite(solicitacoes.results);
    pedidosRegular = filtraRegular(solicitacoes.results);
  }

  resposta.limite = pedidosLimite.length;
  resposta.prioritario = pedidosPrioritarios.length;
  resposta.regular = pedidosRegular.length;
  resposta.total = resposta.limite + resposta.prioritario + resposta.regular;

  return resposta;
};

export const getResumoPendenciasInclusaoAlimentacao = async (
  filtro = "sem_filtro"
) => {
  let resposta = {
    total: 0,
    prioritario: 0,
    limite: 0,
    regular: 0,
  };

  let pedidosPrioritarios = [];
  let pedidosLimite = [];
  let pedidosRegular = [];

  const [continuas, avulsas, cei] = await Promise.all([
    codaeListarSolicitacoesDeInclusaoDeAlimentacao(
      filtro,
      TIPO_SOLICITACAO.SOLICITACAO_CONTINUA
    ),
    codaeListarSolicitacoesDeInclusaoDeAlimentacao(
      filtro,
      TIPO_SOLICITACAO.SOLICITACAO_NORMAL
    ),
    codaeListarSolicitacoesDeInclusaoDeAlimentacao(
      filtro,
      TIPO_SOLICITACAO.SOLICITACAO_CEI
    ),
  ]);

  if (continuas) {
    const todas = safeConcatOn("results", continuas, avulsas, cei);
    pedidosPrioritarios = filtraPrioritarios(todas);
    pedidosLimite = filtraNoLimite(todas);
    pedidosRegular = filtraRegular(todas);
  }

  resposta.limite = pedidosLimite.length;
  resposta.prioritario = pedidosPrioritarios.length;
  resposta.regular = pedidosRegular.length;
  resposta.total = resposta.limite + resposta.prioritario + resposta.regular;

  return resposta;
};

export const getResumoPendenciasKitLancheAvulso = async (
  //TODO: rename method
  filtro = "sem_filtro"
) => {
  let resposta = {
    total: 0,
    prioritario: 0,
    limite: 0,
    regular: 0,
  };

  let pedidosPrioritarios = [];
  let pedidosLimite = [];
  let pedidosRegular = [];

  const [avulsos, cei] = await Promise.all([
    getCODAEPedidosKitLanchePendentes(
      filtro,
      TIPO_SOLICITACAO.SOLICITACAO_NORMAL
    ),
    getCODAEPedidosKitLanchePendentes(filtro, TIPO_SOLICITACAO.SOLICITACAO_CEI),
  ]);

  if (avulsos) {
    const todos = safeConcatOn("results", avulsos, cei);
    pedidosPrioritarios = filtraPrioritarios(todos);
    pedidosLimite = filtraNoLimite(todos);
    pedidosRegular = filtraRegular(todos);
  }

  resposta.limite = pedidosLimite.length;
  resposta.prioritario = pedidosPrioritarios.length;
  resposta.regular = pedidosRegular.length;
  resposta.total = resposta.limite + resposta.prioritario + resposta.regular;

  return resposta;
};

export const getResumoPendenciasKitLancheUnificado = async (
  filtro = "sem_filtro"
) => {
  let resposta = {
    total: 0,
    prioritario: 0,
    limite: 0,
    regular: 0,
  };

  let pedidosPrioritarios = [];
  let pedidosLimite = [];
  let pedidosRegular = [];

  const solicitacoesUnificadas = await getCODAEPedidosSolicitacoesUnificadas(
    filtro
  );

  if (solicitacoesUnificadas) {
    pedidosPrioritarios = filtraPrioritarios(solicitacoesUnificadas.results);
    pedidosLimite = filtraNoLimite(solicitacoesUnificadas.results);
    pedidosRegular = filtraRegular(solicitacoesUnificadas.results);
  }

  resposta.limite = pedidosLimite.length;
  resposta.prioritario = pedidosPrioritarios.length;
  resposta.regular = pedidosRegular.length;
  resposta.total = resposta.limite + resposta.prioritario + resposta.regular;

  return resposta;
};

export const getResumoPendenciasAlteracaoCardapio = async (
  filtro = "sem_filtro"
) => {
  let resposta = {
    total: 0,
    prioritario: 0,
    limite: 0,
    regular: 0,
  };

  let pedidosPrioritarios = [];
  let pedidosLimite = [];
  let pedidosRegular = [];

  const [avulsos, cei] = await Promise.all([
    codaeListarSolicitacoesDeAlteracaoDeCardapio(
      filtro,
      TIPO_SOLICITACAO.SOLICITACAO_NORMAL
    ),
    codaeListarSolicitacoesDeAlteracaoDeCardapio(
      filtro,
      TIPO_SOLICITACAO.SOLICITACAO_CEI
    ),
  ]);

  if (avulsos) {
    const todos = safeConcatOn("results", avulsos, cei);
    pedidosPrioritarios = filtraPrioritarios(todos);
    pedidosLimite = filtraNoLimite(todos);
    pedidosRegular = filtraRegular(todos);
  }

  resposta.limite = pedidosLimite.length;
  resposta.prioritario = pedidosPrioritarios.length;
  resposta.regular = pedidosRegular.length;
  resposta.total = resposta.limite + resposta.prioritario + resposta.regular;

  return resposta;
};

export const getResumoPendenciasSuspensaoCardapio = async (
  filtro = "sem_filtro"
) => {
  let resposta = {
    total: 0,
    informados: 0,
    ciencia: 0,
  };

  let informados = [];
  let ciencia = [];

  const suspensoesRefeicao = await getSuspensaoDeAlimentacaoCODAE(filtro);

  if (suspensoesRefeicao) {
    informados = filtraInformados(suspensoesRefeicao.results);
    ciencia = filtraCiencia(suspensoesRefeicao.results);
  }

  resposta.ciencia = ciencia.length;
  resposta.informados = informados.length;
  resposta.total = resposta.informados + resposta.ciencia;

  return resposta;
};

export const getResumoPendenciasCODAEporDRE = async (filtro) => {
  // TODO Algoritimo de prioridade desse endpoint não bate com usado para os cards por tipo de doc
  const solicitacoes = await getSolicitacoesPendentesAutorizacaoCodae(filtro);

  const reducer = (resumoPorDRE, corrente) => {
    if (!resumoPorDRE[corrente.dre_nome]) {
      resumoPorDRE[corrente.dre_nome] = {};
    }
    if (corrente.prioridade !== "VENCIDO") {
      resumoPorDRE[corrente.dre_nome][corrente.prioridade] = resumoPorDRE[
        corrente.dre_nome
      ][corrente.prioridade]
        ? (resumoPorDRE[corrente.dre_nome][corrente.prioridade] += 1)
        : 1;
      resumoPorDRE[corrente.dre_nome]["TOTAL"] = resumoPorDRE[
        corrente.dre_nome
      ]["TOTAL"]
        ? (resumoPorDRE[corrente.dre_nome]["TOTAL"] += 1)
        : 1;
    }
    return resumoPorDRE;
  };

  let resumoPorDRE = solicitacoes.reduce(reducer, {});

  return resumoPorDRE;
};

export const getResumoPendenciasCODAEporLote = async (filtro) => {
  // TODO Algoritimo de prioridade desse endpoint não bate com usado para os cards por tipo de doc
  const solicitacoes = await getSolicitacoesPendentesAutorizacaoCodae(filtro);

  const reducer = (resumoPorLote, corrente) => {
    if (!resumoPorLote[corrente.lote]) {
      resumoPorLote[corrente.lote] = {};
    }
    if (corrente.prioridade !== "VENCIDO") {
      resumoPorLote[corrente.lote][corrente.prioridade] = resumoPorLote[
        corrente.lote
      ][corrente.prioridade]
        ? (resumoPorLote[corrente.lote][corrente.prioridade] += 1)
        : 1;
      resumoPorLote[corrente.lote]["TOTAL"] = resumoPorLote[corrente.lote][
        "TOTAL"
      ]
        ? (resumoPorLote[corrente.lote]["TOTAL"] += 1)
        : 1;
    }
    return resumoPorLote;
  };

  let resumoPorLote = solicitacoes.reduce(reducer, {});

  return resumoPorLote;
};
