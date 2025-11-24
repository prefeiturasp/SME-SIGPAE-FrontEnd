import {
  GESTAO_PRODUTO_CARDS as CARD_ID,
  ROTAS_SOLICITACOES_HOMOLOGACAO_PRODUTO as ROTA,
} from "src/configs/constants";
import {
  ENDPOINT_HOMOLOGACOES_PRODUTO_STATUS,
  TIPO_PERFIL,
} from "src/constants/shared";
import { ehUsuarioEmpresa, usuarioEhCODAEGestaoProduto } from "./utilities";
const {
  CODAE_SUSPENDEU,
  CODAE_QUESTIONADO,
  CODAE_PEDIU_ANALISE_SENSORIAL,
  CODAE_PENDENTE_HOMOLOGACAO,
  CODAE_HOMOLOGADO,
  CODAE_PEDIU_ANALISE_RECLAMACAO,
  CODAE_QUESTIONOU_UE,
  UE_RESPONDEU_QUESTIONAMENTO,
  CODAE_QUESTIONOU_NUTRISUPERVISOR,
  NUTRISUPERVISOR_RESPONDEU_QUESTIONAMENTO,
  CODAE_NAO_HOMOLOGADO,
  CODAE_AUTORIZOU_RECLAMACAO,
  ESCOLA_OU_NUTRICIONISTA_RECLAMOU,
  TERCEIRIZADA_RESPONDEU_RECLAMACAO,
  TERCEIRIZADA_CANCELOU_SOLICITACAO_HOMOLOGACAO,
} = ENDPOINT_HOMOLOGACOES_PRODUTO_STATUS;

const CARD_PRODUTOS_SUSPENSOS = {
  id: CARD_ID.PRODUTOS_SUSPENSOS,
  titulo: "Produtos suspensos",
  icon: "fa-hand-paper",
  style: "card-cancelled",
  rota: ROTA.PRODUTOS_SUSPENSOS,
  incluir_status: [CODAE_SUSPENDEU, CODAE_AUTORIZOU_RECLAMACAO],
};
const CARD_HOMOLOGADOS = {
  id: CARD_ID.HOMOLOGADOS,
  titulo: "Homologados",
  icon: "fa-check",
  style: "card-authorized",
  rota: ROTA.SOLICITACOES_HOMOLOGADAS,
  incluir_status: [CODAE_HOMOLOGADO],
};
const CARD_NAO_HOMOLOGADOS = {
  id: CARD_ID.NAO_HOMOLOGADOS,
  titulo: "Não homologados",
  icon: "fa-ban",
  style: "card-denied",
  rota: ROTA.SOLICITACOES_NAO_HOMOLOGADAS,
  incluir_status: [
    CODAE_NAO_HOMOLOGADO,
    TERCEIRIZADA_CANCELOU_SOLICITACAO_HOMOLOGACAO,
  ],
};
export const CARD_AGUARDANDO_ANALISE_RECLAMACAO = {
  id: CARD_ID.AGUARDANDO_ANALISE_RECLAMACAO,
  titulo: "Aguardando análise das reclamações",
  titulo_menu: "Ag. análise das reclamações", // FIXME: Confirmar nome no menu
  icon: "fa-history",
  style: "card-awaiting-complain",
  rota: ROTA.AGUARDANDO_ANALISE_RECLAMACAO,
  incluir_status: [
    CODAE_PEDIU_ANALISE_RECLAMACAO,
    TERCEIRIZADA_RESPONDEU_RECLAMACAO,
    CODAE_QUESTIONOU_UE,
    UE_RESPONDEU_QUESTIONAMENTO,
    CODAE_QUESTIONOU_NUTRISUPERVISOR,
    NUTRISUPERVISOR_RESPONDEU_QUESTIONAMENTO,
  ],
};
const CARD_AGUARDANDO_ANALISE_SENSORIAL = {
  id: CARD_ID.AGUARDANDO_ANALISE_SENSORIAL,
  titulo: "Aguardando amostra para análise sensorial",
  titulo_menu: "Ag. análise sensoriais",
  icon: "fa-search",
  style: "card-awaiting-sensory",
  rota: ROTA.AGUARDANDO_ANALISE_SENSORIAL,
  incluir_status: [CODAE_PEDIU_ANALISE_SENSORIAL],
};
const CARD_PENDENTE_HOMOLOGACAO = {
  id: CARD_ID.PENDENTE_HOMOLOGACAO,
  titulo: "Pendentes de homologação",
  icon: "fa-exclamation-triangle",
  style: "card-pending",
  rota: ROTA.SOLICITACOES_PENDENTE_HOMOLOGACAO,
  incluir_status: [CODAE_PENDENTE_HOMOLOGACAO],
};

const CARD_CORRECAO_DE_PRODUTO = {
  id: CARD_ID.CORRECAO_DE_PRODUTO,
  titulo: "Correções de Produtos",
  icon: "fa-pencil-alt",
  style: "card-product-correction",
  rota: ROTA.CORRECAO_DE_PRODUTO,
  incluir_status: [CODAE_QUESTIONADO],
};

export const CARD_RESPONDER_QUESTIONAMENTOS_DA_CODAE = {
  id: CARD_ID.RESPONDER_QUESTIONAMENTOS_DA_CODAE,
  titulo: "Responder Questionamentos da CODAE",
  titulo_menu: (
    <span>
      Responder Questionamentos <br /> da CODAE
    </span>
  ),
  icon: "fa-exclamation-triangle",
  style: "card-pending",
  rota: ROTA.RESPONDER_QUESTIONAMENTOS_DA_CODAE,
  incluir_status: [
    CODAE_QUESTIONOU_UE,
    CODAE_PEDIU_ANALISE_RECLAMACAO,
    CODAE_QUESTIONOU_NUTRISUPERVISOR,
  ],
};

export const TODOS_OS_CARDS = [
  CARD_PRODUTOS_SUSPENSOS,
  CARD_CORRECAO_DE_PRODUTO,
  CARD_AGUARDANDO_ANALISE_RECLAMACAO,
  CARD_AGUARDANDO_ANALISE_SENSORIAL,
  CARD_PENDENTE_HOMOLOGACAO,
  CARD_HOMOLOGADOS,
  CARD_NAO_HOMOLOGADOS,
  CARD_RESPONDER_QUESTIONAMENTOS_DA_CODAE,
];

export const listarCardsPermitidos = () => {
  const perfil = localStorage.getItem("tipo_perfil");

  if (perfil === TIPO_PERFIL.GESTAO_PRODUTO) {
    const cardPendenteHomologacao = Object.assign(
      {},
      CARD_PENDENTE_HOMOLOGACAO,
    );
    const cardAguardandoAnaliseReclamacao = Object.assign(
      {},
      CARD_AGUARDANDO_ANALISE_RECLAMACAO,
    );
    cardAguardandoAnaliseReclamacao.incluir_status.push(
      TERCEIRIZADA_RESPONDEU_RECLAMACAO,
    );

    cardAguardandoAnaliseReclamacao.incluir_status.push(
      ESCOLA_OU_NUTRICIONISTA_RECLAMOU,
    );
    return [
      cardPendenteHomologacao,
      CARD_CORRECAO_DE_PRODUTO,
      CARD_AGUARDANDO_ANALISE_SENSORIAL,
      CARD_PRODUTOS_SUSPENSOS,
      CARD_HOMOLOGADOS,
      CARD_NAO_HOMOLOGADOS,
      cardAguardandoAnaliseReclamacao,
    ];
  } else if (ehUsuarioEmpresa()) {
    return [
      CARD_PRODUTOS_SUSPENSOS,
      CARD_AGUARDANDO_ANALISE_RECLAMACAO,
      CARD_PENDENTE_HOMOLOGACAO,
      CARD_HOMOLOGADOS,
      CARD_NAO_HOMOLOGADOS,
    ];
  } else if ([TIPO_PERFIL.TERCEIRIZADA].includes(perfil)) {
    const cardAguardandoAnaliseReclamacao = Object.assign(
      {},
      CARD_AGUARDANDO_ANALISE_RECLAMACAO,
    );
    cardAguardandoAnaliseReclamacao.incluir_status.push(
      TERCEIRIZADA_RESPONDEU_RECLAMACAO,
    );

    cardAguardandoAnaliseReclamacao.incluir_status.push(
      ESCOLA_OU_NUTRICIONISTA_RECLAMOU,
    );
    return [
      CARD_PRODUTOS_SUSPENSOS,
      CARD_CORRECAO_DE_PRODUTO,
      CARD_AGUARDANDO_ANALISE_RECLAMACAO,
      CARD_AGUARDANDO_ANALISE_SENSORIAL,
      CARD_PENDENTE_HOMOLOGACAO,
      CARD_HOMOLOGADOS,
      CARD_NAO_HOMOLOGADOS,
      CARD_RESPONDER_QUESTIONAMENTOS_DA_CODAE,
    ];
  } else if (
    [TIPO_PERFIL.SUPERVISAO_NUTRICAO, TIPO_PERFIL.ESCOLA].includes(perfil)
  ) {
    const cardAguardandoAnaliseReclamacao = Object.assign(
      {},
      CARD_AGUARDANDO_ANALISE_RECLAMACAO,
    );

    cardAguardandoAnaliseReclamacao.incluir_status.push(
      TERCEIRIZADA_RESPONDEU_RECLAMACAO,
    );

    cardAguardandoAnaliseReclamacao.incluir_status.push(
      ESCOLA_OU_NUTRICIONISTA_RECLAMOU,
    );

    cardAguardandoAnaliseReclamacao.incluir_status.push(CODAE_QUESTIONOU_UE);

    return [
      cardAguardandoAnaliseReclamacao,
      CARD_PRODUTOS_SUSPENSOS,
      CARD_NAO_HOMOLOGADOS,
      CARD_HOMOLOGADOS,
      CARD_RESPONDER_QUESTIONAMENTOS_DA_CODAE,
    ];
  } else if (
    [
      TIPO_PERFIL.DIRETORIA_REGIONAL,
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
      TIPO_PERFIL.NUTRICAO_MANIFESTACAO,
      TIPO_PERFIL.ORGAO_FISCALIZADOR,
      TIPO_PERFIL.CODAE_GABINETE,
      TIPO_PERFIL.DINUTRE,
    ].includes(perfil)
  ) {
    const cardHomologados = Object.assign({}, CARD_HOMOLOGADOS);
    const cardAguardandoAnaliseReclamacao = Object.assign(
      {},
      CARD_AGUARDANDO_ANALISE_RECLAMACAO,
    );

    cardAguardandoAnaliseReclamacao.incluir_status.push(
      ESCOLA_OU_NUTRICIONISTA_RECLAMOU,
    );
    const listaDeCards = [
      CARD_PRODUTOS_SUSPENSOS,
      CARD_NAO_HOMOLOGADOS,
      cardHomologados,
      cardAguardandoAnaliseReclamacao,
    ];
    if (perfil !== TIPO_PERFIL.ORGAO_FISCALIZADOR) {
      listaDeCards.push(CARD_RESPONDER_QUESTIONAMENTOS_DA_CODAE);
    }

    return listaDeCards;
  }

  const cardHomologados = Object.assign({}, CARD_HOMOLOGADOS);
  cardHomologados.incluir_status.push(
    ESCOLA_OU_NUTRICIONISTA_RECLAMOU,
    CODAE_PEDIU_ANALISE_RECLAMACAO,
    TERCEIRIZADA_RESPONDEU_RECLAMACAO,
  );
  return [CARD_PRODUTOS_SUSPENSOS, CARD_NAO_HOMOLOGADOS, cardHomologados];
};

export const CADASTRO_GERAL = {
  titulo: "Cadastro Geral",
  rota: "cadastro-geral",
};
export const CADASTRO_PRODUTOS_PROVINIENTES_EDITAL = {
  titulo: "Cadastro de Produtos                 Provenientes do Edital",
  rota: "cadastro-produtos-provinientes-edital",
};
export const VINCULAR_PRODUTOS_EDITAIS = {
  titulo: "Vincular Produtos aos Editais",
  rota: "vincular-produto-edital",
};

export const CADASTROS = usuarioEhCODAEGestaoProduto()
  ? [CADASTRO_GERAL].concat([
      CADASTRO_PRODUTOS_PROVINIENTES_EDITAL,
      VINCULAR_PRODUTOS_EDITAIS,
    ])
  : [CADASTRO_GERAL];

export const EDITAIS_INVALIDOS = ["78/SME/2016", "41/SME/2017"];
