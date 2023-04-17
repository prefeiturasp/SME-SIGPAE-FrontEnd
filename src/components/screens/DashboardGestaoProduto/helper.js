import {
  truncarString,
  usuarioEhCoordenadorNutriSupervisao,
  usuarioEhEmpresaTerceirizada,
  usuarioEhCODAEGestaoProduto,
  parseDataHoraBrToMoment,
  comparaObjetosMoment,
  usuarioEhEscolaTerceirizada,
  usuarioEhEscolaTerceirizadaDiretor
} from "helpers/utilities";
import {
  RELATORIO,
  GESTAO_PRODUTO,
  EDITAR,
  PESQUISA_DESENVOLVIMENTO,
  ATIVACAO_DE_PRODUTO
} from "configs/constants";
import { ENDPOINT_HOMOLOGACOES_PRODUTO_STATUS } from "constants/shared";
import {
  CARD_RESPONDER_QUESTIONAMENTOS_DA_CODAE,
  CARD_AGUARDANDO_ANALISE_RECLAMACAO
} from "helpers/gestaoDeProdutos";
const {
  CODAE_PEDIU_ANALISE_RECLAMACAO,
  TERCEIRIZADA_RESPONDEU_RECLAMACAO,
  ESCOLA_OU_NUTRICIONISTA_RECLAMOU,
  CODAE_PEDIU_ANALISE_SENSORIAL,
  CODAE_SUSPENDEU,
  CODAE_HOMOLOGADO,
  CODAE_AUTORIZOU_RECLAMACAO,
  CODAE_NAO_HOMOLOGADO,
  CODAE_QUESTIONADO,
  CODAE_QUESTIONOU_UE,
  TERCEIRIZADA_CANCELOU_SOLICITACAO_HOMOLOGACAO
} = ENDPOINT_HOMOLOGACOES_PRODUTO_STATUS;

export const incluirDados = (statuses, arr) => {
  const result = [];
  arr.forEach(el => {
    if (el.dados.length && statuses.includes(el.status.toLowerCase())) {
      result.push(...el.dados);
    }
  });
  return result;
};

const gerarLinkDoItem = (item, apontaParaEdicao, titulo) => {
  if (
    item.status.toLowerCase() === CODAE_PEDIU_ANALISE_RECLAMACAO &&
    usuarioEhEmpresaTerceirizada()
  ) {
    return `/${GESTAO_PRODUTO}/responder-reclamacao/consulta?uuid=${item.uuid}`;
  } else if (
    item.status.toLowerCase() === CODAE_PEDIU_ANALISE_SENSORIAL &&
    usuarioEhEmpresaTerceirizada()
  ) {
    return `/${PESQUISA_DESENVOLVIMENTO}/relatorio-analise-sensorial?uuid=${
      item.uuid
    }`;
  } else if (
    usuarioEhCODAEGestaoProduto() &&
    CARD_AGUARDANDO_ANALISE_RECLAMACAO.titulo === titulo
  ) {
    return `/${GESTAO_PRODUTO}/avaliar-reclamacao-produto?uuid=${item.uuid}
      `;
  } else if (
    usuarioEhCODAEGestaoProduto() &&
    item.status.toLowerCase() === CODAE_SUSPENDEU
  ) {
    return `/${GESTAO_PRODUTO}/${ATIVACAO_DE_PRODUTO}/detalhe?id=${item.uuid}`;
  } else if (
    usuarioEhCODAEGestaoProduto() &&
    item.status === "CODAE_HOMOLOGADO" &&
    item.data_edital_suspenso_mais_recente
  ) {
    return `/${GESTAO_PRODUTO}/${RELATORIO}?uuid=${
      item.uuid
    }&card_suspensos=${true}`;
  } else if (
    usuarioEhEmpresaTerceirizada() &&
    [
      CODAE_HOMOLOGADO,
      CODAE_SUSPENDEU,
      CODAE_NAO_HOMOLOGADO,
      CODAE_QUESTIONADO,
      CODAE_AUTORIZOU_RECLAMACAO,
      TERCEIRIZADA_CANCELOU_SOLICITACAO_HOMOLOGACAO
    ].includes(item.status.toLowerCase())
  ) {
    return `/${GESTAO_PRODUTO}/${EDITAR}?uuid=${item.uuid}`;
  } else if (
    (usuarioEhEscolaTerceirizadaDiretor() ||
      usuarioEhEscolaTerceirizada() ||
      usuarioEhEmpresaTerceirizada()) &&
    item.status.toLowerCase() === CODAE_QUESTIONOU_UE &&
    CARD_RESPONDER_QUESTIONAMENTOS_DA_CODAE.titulo === titulo
  ) {
    return `/${GESTAO_PRODUTO}/responder-questionamento-ue/?nome_produto=${
      item.nome_produto
    }`;
  } else if (
    CARD_AGUARDANDO_ANALISE_RECLAMACAO.titulo === titulo &&
    (usuarioEhEscolaTerceirizadaDiretor() || usuarioEhEscolaTerceirizada())
  ) {
    return `/${GESTAO_PRODUTO}/nova-reclamacao-de-produto?nome_produto=${
      item.nome_produto
    }&marca_produto=${item.marca_produto}&fabricante_produto=${
      item.fabricante_produto
    }`;
  } else if (
    usuarioEhCoordenadorNutriSupervisao() &&
    CARD_RESPONDER_QUESTIONAMENTOS_DA_CODAE.titulo === titulo
  ) {
    return `/${GESTAO_PRODUTO}/responder-questionamento-nutrisupervisor/?nome_produto=${
      item.nome_produto
    }`;
  }

  return apontaParaEdicao
    ? `/${GESTAO_PRODUTO}/${EDITAR}?uuid=${item.uuid}`
    : `/${GESTAO_PRODUTO}/${RELATORIO}?uuid=${item.uuid}`;
};

export const ordenaPorLogMaisRecente = (a, b) => {
  let data_a = parseDataHoraBrToMoment(a.log_mais_recente);
  let data_b = parseDataHoraBrToMoment(b.log_mais_recente);
  if (a.status === "CODAE_HOMOLOGADO" && a.data_edital_suspenso_mais_recente) {
    data_a = parseDataHoraBrToMoment(a.data_edital_suspenso_mais_recente);
  }
  if (b.status === "CODAE_HOMOLOGADO" && b.data_edital_suspenso_mais_recente) {
    data_b = parseDataHoraBrToMoment(b.data_edital_suspenso_mais_recente);
  }
  return comparaObjetosMoment(data_b, data_a);
};

const getText = item => {
  const TAMANHO_MAXIMO = 48;
  let appendix = "";

  if (
    usuarioEhEmpresaTerceirizada() &&
    item.status.toLowerCase() === CODAE_PEDIU_ANALISE_RECLAMACAO
  ) {
    appendix = ` (${item.qtde_questionamentos})`;
  }
  if (
    usuarioEhCODAEGestaoProduto() &&
    [
      CODAE_PEDIU_ANALISE_RECLAMACAO,
      ESCOLA_OU_NUTRICIONISTA_RECLAMOU,
      TERCEIRIZADA_RESPONDEU_RECLAMACAO
    ].includes(item.status.toLowerCase())
  ) {
    appendix = ` (${item.qtde_reclamacoes})`;
  }

  return `${item.id_externo} - ${truncarString(
    item.nome_produto,
    TAMANHO_MAXIMO - appendix.length
  )}${appendix}`;
};

export const formataCards = (items, apontaParaEdicao, titulo) => {
  return items.sort(ordenaPorLogMaisRecente).map(item => ({
    text: getText(item),
    date:
      item.status === "CODAE_HOMOLOGADO" &&
      item.data_edital_suspenso_mais_recente
        ? item.data_edital_suspenso_mais_recente
        : item.log_mais_recente,
    link: gerarLinkDoItem(item, apontaParaEdicao, titulo),
    nome_usuario_log_de_reclamacao: item.nome_usuario_log_de_reclamacao,
    status: item.status,
    marca: item.marca_produto,
    editais: item.editais,
    produto_editais: item.produto_editais
  }));
};
