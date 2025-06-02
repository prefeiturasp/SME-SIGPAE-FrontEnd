import { API_URL } from "../constants/config";
import {
  filtraNoLimite,
  filtraPrioritarios,
  filtraRegular,
} from "../helpers/painelPedidos";
import { dreListarSolicitacoesDeAlteracaoDeCardapio } from "src/services/alteracaoDeCardapio";
import { SOLICITACOES } from "./constants";
import { dreListarSolicitacoesDeInclusaoDeAlimentacao } from "src/services/inclusaoDeAlimentacao";
import { getDREPedidosDeKitLanche } from "src/services/kitLanche";
import { getCODAEPedidosSolicitacoesUnificadas } from "src/services/solicitacaoUnificada.service";
// TODO Verificar/Resolver porque Kit Lanche tem um services exclusivo.
import { getSuspensoesDeAlimentacaoInformadas } from "src/services/suspensaoDeAlimentacao.service";
import { TIPO_SOLICITACAO } from "src/constants/shared";
import { safeConcatOn } from "src/helpers/utilities";
import axios from "./_base";
import { ErrorHandlerFunction } from "./service-helpers";

const SOLICITACOES_DRE = `${API_URL}/diretoria-regional-solicitacoes`;

export const getResumoPendenciasDREAlteracoesDeCardapio = async (
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
    dreListarSolicitacoesDeAlteracaoDeCardapio(
      filtro,
      TIPO_SOLICITACAO.SOLICITACAO_NORMAL
    ),
    dreListarSolicitacoesDeAlteracaoDeCardapio(
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

const getResumoPendenciasDREInclusaoDeAlimentacaoAvulsa = async (
  //FIXME: must include CEI?
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
    dreListarSolicitacoesDeInclusaoDeAlimentacao(
      filtro,
      TIPO_SOLICITACAO.SOLICITACAO_NORMAL
    ),
    dreListarSolicitacoesDeInclusaoDeAlimentacao(
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

const getResumoPendenciasDREInclusaoDeAlimentacaoContinua = async (
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

  const solicitacoes = await dreListarSolicitacoesDeInclusaoDeAlimentacao(
    filtro,
    TIPO_SOLICITACAO.SOLICITACAO_CONTINUA
  );

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

export const getResumoPendenciasDREInclusaoDeAlimentacao = async (
  filtro = "sem_filtro"
) => {
  let resposta = {
    total: 0,
    prioritario: 0,
    limite: 0,
    regular: 0,
  };

  const resumoAvulsa = await getResumoPendenciasDREInclusaoDeAlimentacaoAvulsa(
    filtro
  );
  const resumoContinua =
    await getResumoPendenciasDREInclusaoDeAlimentacaoContinua(filtro);

  resposta.limite = resumoAvulsa.limite + resumoContinua.limite;
  resposta.prioritario = resumoAvulsa.prioritario + resumoContinua.prioritario;
  resposta.regular = resumoAvulsa.regular + resumoContinua.regular;
  resposta.total = resumoAvulsa.total + resumoContinua.total;

  return resposta;
};

export const getResumoPendenciasDREInversaoDeDiaDeCardapio = async () => {
  let resposta = {
    total: 0,
    prioritario: 0,
    limite: 0,
    regular: 0,
  };

  let pedidosPrioritarios = [];
  let pedidosLimite = [];
  let pedidosRegular = [];

  resposta.limite = pedidosLimite.length;
  resposta.prioritario = pedidosPrioritarios.length;
  resposta.regular = pedidosRegular.length;
  resposta.total = resposta.limite + resposta.prioritario + resposta.regular;

  return resposta;
};

export const getResumoPendenciasDREKitLanche = async (
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
    getDREPedidosDeKitLanche(filtro, TIPO_SOLICITACAO.SOLICITACAO_NORMAL),
    getDREPedidosDeKitLanche(filtro, TIPO_SOLICITACAO.SOLICITACAO_CEI),
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

export const getResumoPendenciasDRESuspensaoDeAlimentacao = async (
  filtro = "sem_filtro"
) => {
  let resposta = {
    total: 0,
    prioritario: 0,
    limite: 0,
    regular: 0,
  };

  const solicitacoes = await getSuspensoesDeAlimentacaoInformadas(filtro);
  resposta.prioritario = solicitacoes.count;
  resposta.total = resposta.prioritario;
  return resposta;
};

export const getResumoPendenciasDRESolicitacoesUnificadas = async (
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

  const solicitacoes = await getCODAEPedidosSolicitacoesUnificadas(filtro);

  if (solicitacoes) {
    pedidosPrioritarios = filtraPrioritarios(
      solicitacoes.results,
      (filtro = "solicitacao_kit_lanche")
    );
    pedidosLimite = filtraNoLimite(
      solicitacoes.results,
      (filtro = "solicitacao_kit_lanche")
    );
    pedidosRegular = filtraRegular(
      solicitacoes.results,
      (filtro = "solicitacao_kit_lanche")
    );
  }

  resposta.limite = pedidosLimite.length;
  resposta.prioritario = pedidosPrioritarios.length;
  resposta.regular = pedidosRegular.length;
  resposta.total = resposta.limite + resposta.prioritario + resposta.regular;

  return resposta;
};

export const getSolicitacoesPendentesValidacaoDRE = async (
  filtroAplicado,
  tipoVisao,
  params
) => {
  const url = `${SOLICITACOES_DRE}/${SOLICITACOES.PENDENTES_VALIDACAO_DRE}/${filtroAplicado}/${tipoVisao}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);

  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getSolicitacoesPendentesDRE = async (params) => {
  const url = `${SOLICITACOES_DRE}/${SOLICITACOES.PENDENTES}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getSolicitacoesAutorizadasDRE = async (params) => {
  const url = `${SOLICITACOES_DRE}/${SOLICITACOES.AUTORIZADOS}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getSolicitacoesAguardandoCODAE = async (params) => {
  const url = `${SOLICITACOES_DRE}/${SOLICITACOES.AGUARDANDO_CODAE}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getSolicitacoesCanceladasDRE = async (params) => {
  const url = `${SOLICITACOES_DRE}/${SOLICITACOES.CANCELADOS}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};

export const getSolicitacoesNegadasDRE = async (params) => {
  const url = `${SOLICITACOES_DRE}/${SOLICITACOES.NEGADOS}/`;
  const response = await axios.get(url, { params }).catch(ErrorHandlerFunction);
  if (response) {
    const data = { data: response.data, status: response.status };
    return data;
  }
};
