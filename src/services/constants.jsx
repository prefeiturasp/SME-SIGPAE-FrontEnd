import { API_URL } from "../constants/config";
import authService from "./auth";

export { TIPO_SOLICITACAO } from "src/constants/shared";

export const FLUXO = {
  INICIO_PEDIDO: "inicio-pedido",
  CODAE_AUTORIZA: "codae-autoriza-pedido",
  TERCEIRIZADA_TOMA_CIENCIA: "terceirizada-toma-ciencia",
  DRE_NAO_VALIDA: "diretoria-regional-nao-valida-pedido",
  DRE_VALIDA: "diretoria-regional-valida-pedido",
  ESCOLA_CANCELA: "escola-cancela-pedido-48h-antes",
  DRE_CANCELA: "diretoria-regional-cancela",
  CODAE_NEGA: "codae-cancela-pedido",
  CODAE_QUESTIONA: "codae-questiona-pedido",
  TERCEIRIZADA_RESPONDE_QUESTIONAMENTO: "terceirizada-responde-questionamento",
};

export const PEDIDOS = {
  TERCEIRIZADA: "pedidos-terceirizadas",
  CODAE: "pedidos-codae",
  DRE: "pedidos-diretoria-regional",
  MEUS: "minhas-solicitacoes",
};

export const SOLICITACOES = {
  AUTORIZADOS: "autorizados",
  AGUARDANDO_CODAE: "aguardando-codae",
  PENDENTES: "pendentes-autorizacao",
  PENDENTES_CIENCIA: "pendentes-ciencia",
  NEGADOS: "negados",
  CANCELADOS: "cancelados",
  PENDENTES_VALIDACAO_DRE: "pendentes-validacao",
  QUESTIONAMENTOS: "questionamentos",
  ANOS_COM_DIETAS: "anos-com-dietas",
  TOTAIS_GERENCIAL_DIETAS: "totais-gerencial-dietas",
};

export const TIPO_MOTIVO = {
  INCLUSAO_NORMAL: "motivos-inclusao-normal",
  INCLUSAO_CONTINUA: "motivos-inclusao-continua",
  ALTERACAO_TIPO_ALIMENTACAO: "motivos-alteracao-tipo-alimentacao",
  NEGACAO: "motivos-negacao",
  SUSPENSAO_CARDAPIO: "motivos-suspensao-cardapio",
  DRE_NAO_VALIDA: "motivos-dre-nao-valida",
};

export const RESUMO_POR = {
  TIPO_DE_SOLICITACAO: "desc_doc",
  LOTE: "lote",
  DRE: "dre_nome",
};

export const SOLICITACOES_DIETA = `${API_URL}/dieta-especial`;
export const API_ALTERACOES_CARDAPIO = `${API_URL}/alteracoes-cardapio`;
export const API_ALTERACOES_CARDAPIO_CEI = `${API_URL}/alteracoes-cardapio-cei`;
export const API_ALTERACOES_CARDAPIO_CEMEI = `${API_URL}/alteracoes-cardapio-cemei`;

export const URL_INCLUSAO_NORMAL = `${API_URL}/grupos-inclusao-alimentacao-normal`;
export const URL_INCLUSAO_CONTINUA = `${API_URL}/inclusoes-alimentacao-continua`;
export const URL_INCLUSAO_CEI = `${API_URL}/inclusoes-alimentacao-da-cei`;
export const URL_INCLUSAO_CEMEI = `${API_URL}/inclusao-alimentacao-cemei`;

export const URL_KIT_LANCHES = `${API_URL}/kit-lanches`;
export const URL_KIT_LANCHES_SOLICITACOES_AVULSA = `${API_URL}/solicitacoes-kit-lanche-avulsa`;
export const URL_KIT_LANCHES_SOLICITACOES_CEI = `${API_URL}/solicitacoes-kit-lanche-cei-avulsa`;
export const URL_KIT_LANCHES_SOLICITACOES_CEMEI = `${API_URL}/solicitacao-kit-lanche-cemei`;

export const AUTH_TOKEN = {
  Authorization: `JWT ${authService.getToken()}`,
  "Content-Type": "application/json",
};
