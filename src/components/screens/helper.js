import { filter, propEq } from "ramda";
import {
  ALTERACAO_TIPO_ALIMENTACAO,
  ALTERACAO_TIPO_ALIMENTACAO_CEMEI,
  DETALHE_CRONOGRAMA,
  DIETA_ESPECIAL,
  INCLUSAO_ALIMENTACAO,
  INCLUSAO_ALIMENTACAO_CEMEI,
  INVERSAO_CARDAPIO,
  PRE_RECEBIMENTO,
  RELATORIO,
  SOLICITACAO_KIT_LANCHE,
  SOLICITACAO_KIT_LANCHE_CEMEI,
  SOLICITACAO_KIT_LANCHE_UNIFICADA,
  SUSPENSAO_ALIMENTACAO,
  SUSPENSAO_ALIMENTACAO_CEI
} from "../../configs/constants";
import {
  truncarString,
  usuarioEhEscolaTerceirizada,
  usuarioEhEscolaTerceirizadaDiretor
} from "../../helpers/utilities";
import { TIPO_PERFIL, TIPO_SOLICITACAO } from "constants/shared";
import { STATUS_ALIMENTO } from "./const";

export const ALT_CARDAPIO = "ALT_CARDAPIO";
export const ALT_CARDAPIO_CEMEI = "ALT_CARDAPIO_CEMEI";
const DIETA_ESP = "DIETA_ESPECIAL";
const INC_ALIMENTA = "INC_ALIMENTA";
const INV_CARDAPIO = "INV_CARDAPIO";
const KIT_LANCHE_AVULSA = "KIT_LANCHE_AVULSA";
const KIT_LANCHE_UNIFICADA = "KIT_LANCHE_UNIFICADA";
const SUSP_ALIMENTACAO = "SUSP_ALIMENTACAO";
const SUSP_ALIMENTACAO_CEI = "SUSP_ALIMENTACAO_CEI";
const INC_ALIMENTA_CONTINUA = "INC_ALIMENTA_CONTINUA";
const INC_ALIMENTA_CEI = "INC_ALIMENTA_CEI";
const ALT_CARDAPIO_CEI = "ALT_CARDAPIO_CEI";
const KIT_LANCHE_AVULSA_CEI = "KIT_LANCHE_AVULSA_CEI";
const KIT_LANCHE_CEMEI = "KIT_LANCHE_CEMEI";
const INC_ALIMENTA_CEMEI = "INC_ALIMENTA_CEMEI";

export const LOG_PARA = {
  ESCOLA: 0,
  DRE: 1,
  TERCEIRIZADA: 2,
  CODAE: 3,
  NUTRISUPERVISAO: 4
};

export const ajustaFormatoLogPainelDietaEspecial = (logs, card) => {
  if (!logs) return;
  return logs.map(log => {
    let tamanhoString = 53;
    let descricao = log.descricao;
    let texto = truncarString(descricao, tamanhoString);
    let nomeAluno = log.nome_aluno;
    let textoDieta =
      (log.codigo_eol_aluno !== null
        ? log.codigo_eol_aluno
        : "(Aluno não matriculado)") +
      " - " +
      nomeAluno;
    let serie = log.serie ? log.serie : "";
    // Faz uma abreviação no texto quando tiver data com hora pra não quebrar o layout.
    if (
      log.data_log.length > 10 &&
      texto
        .split("-")
        .pop()
        .trim() === "Alteração U.E"
    ) {
      texto = texto.replace("Alteração", "Alt.");
    }
    return {
      conferido: log.conferido,
      lote_uuid: log.lote_uuid,
      text: truncarString(
        `${textoDieta}${
          usuarioEhEscolaTerceirizadaDiretor() || usuarioEhEscolaTerceirizada()
            ? " - " + serie
            : ""
        }`,
        41
      ),
      texto_inteiro: `${textoDieta}${
        usuarioEhEscolaTerceirizadaDiretor() || usuarioEhEscolaTerceirizada()
          ? " - " + serie
          : ""
      }`,
      date: log.data_log,
      link: `/${DIETA_ESPECIAL}/${RELATORIO}?uuid=${
        log.uuid
      }&ehInclusaoContinua=${log.tipo_doc ===
        INC_ALIMENTA_CONTINUA}&card=${card}`
    };
  });
};

export const ajustarFormatoLog = (logs, card) => {
  return logs.map(log => {
    let tamanhoString = 52;
    let descricao = log.descricao;
    let solicitacao = "falta-implementar";
    let tipo = "";
    switch (log.tipo_doc) {
      case ALT_CARDAPIO:
        solicitacao = ALTERACAO_TIPO_ALIMENTACAO;
        tipo = TIPO_SOLICITACAO.SOLICITACAO_NORMAL;
        break;

      case ALT_CARDAPIO_CEMEI:
        solicitacao = ALTERACAO_TIPO_ALIMENTACAO_CEMEI;
        tipo = TIPO_SOLICITACAO.SOLICITACAO_CEMEI;
        break;

      case DIETA_ESP:
        solicitacao = DIETA_ESPECIAL;
        descricao = log.descricao_dieta_especial;
        tamanhoString = 150;
        break;

      case KIT_LANCHE_AVULSA:
        solicitacao = SOLICITACAO_KIT_LANCHE;
        tipo = TIPO_SOLICITACAO.SOLICITACAO_NORMAL;
        break;

      case INV_CARDAPIO:
        solicitacao = INVERSAO_CARDAPIO;
        tipo = TIPO_SOLICITACAO.SOLICITACAO_NORMAL;
        break;

      case INC_ALIMENTA:
        solicitacao = INCLUSAO_ALIMENTACAO;
        tipo = TIPO_SOLICITACAO.SOLICITACAO_NORMAL;
        break;

      case SUSP_ALIMENTACAO:
        solicitacao = SUSPENSAO_ALIMENTACAO;
        tipo = TIPO_SOLICITACAO.SOLICITACAO_NORMAL;
        break;

      case SUSP_ALIMENTACAO_CEI:
        solicitacao = SUSPENSAO_ALIMENTACAO_CEI;
        tipo = TIPO_SOLICITACAO.SOLICITACAO_NORMAL;
        break;

      case KIT_LANCHE_UNIFICADA:
        solicitacao = SOLICITACAO_KIT_LANCHE_UNIFICADA;
        tipo = TIPO_SOLICITACAO.SOLICITACAO_NORMAL;
        break;

      case INC_ALIMENTA_CONTINUA:
        solicitacao = INCLUSAO_ALIMENTACAO;
        tipo = TIPO_SOLICITACAO.SOLICITACAO_CONTINUA;
        descricao =
          (usuarioEhEscolaTerceirizadaDiretor() ||
            usuarioEhEscolaTerceirizada()) &&
          log.motivo === "ETEC"
            ? descricao.replace("Contínua", "- ETEC")
            : descricao;
        break;

      case INC_ALIMENTA_CEI:
        solicitacao = INCLUSAO_ALIMENTACAO;
        tipo = TIPO_SOLICITACAO.SOLICITACAO_CEI;
        break;

      case INC_ALIMENTA_CEMEI:
        solicitacao = INCLUSAO_ALIMENTACAO_CEMEI;
        tipo = TIPO_SOLICITACAO.SOLICITACAO_CEMEI;
        break;

      case ALT_CARDAPIO_CEI:
        solicitacao = ALTERACAO_TIPO_ALIMENTACAO;
        tipo = TIPO_SOLICITACAO.SOLICITACAO_CEI;
        tamanhoString = 56;
        break;

      case KIT_LANCHE_AVULSA_CEI:
        solicitacao = SOLICITACAO_KIT_LANCHE;
        tipo = TIPO_SOLICITACAO.SOLICITACAO_CEI;
        break;

      case KIT_LANCHE_CEMEI:
        solicitacao = SOLICITACAO_KIT_LANCHE_CEMEI;
        tipo = TIPO_SOLICITACAO.SOLICITACAO_CEMEI;
        break;

      default:
        solicitacao = "NAO_ENCONTRADO";
        break;
    }

    const getDate = () => {
      let date = log.data_log;
      const tipoPerfil = localStorage.getItem("tipo_perfil");
      if (
        tipoPerfil === TIPO_PERFIL.ESCOLA &&
        log.tipo_doc === KIT_LANCHE_UNIFICADA &&
        log.escolas_quantidades &&
        log.escolas_quantidades[0].cancelado &&
        ["escola", "diretoriaregional"].includes(
          log.escolas_quantidades[0].cancelado_por.tipo_usuario
        )
      ) {
        date = log.escolas_quantidades[0].cancelado_em;
      }
      return date;
    };

    return {
      text:
        usuarioEhEscolaTerceirizadaDiretor() || usuarioEhEscolaTerceirizada()
          ? truncarString(descricao, tamanhoString) +
            (log.serie ? " - " + log.serie : "")
          : truncarString(descricao, tamanhoString) + " / " + log.escola_nome,
      conferido: log.conferido || log.terceirizada_conferiu_gestao,
      lote_uuid: log.lote_uuid,
      date: getDate(),
      link: `/${solicitacao}/${RELATORIO}?uuid=${
        log.uuid
      }&ehInclusaoContinua=${log.tipo_doc ===
        INC_ALIMENTA_CONTINUA}&tipoSolicitacao=${tipo}&card=${card}`
    };
  });
};

export const ajustarFormaLotes = lotes => {
  return lotes.map(lote => {
    return {
      id: lote.uuid,
      lote: lote.nome,
      dre: lote.diretoria_regional && lote.diretoria_regional.nome,
      tipo: lote.tipo_gestao && lote.tipo_gestao.nome
    };
  });
};

export const slugify = str => {
  // Function from https://gist.github.com/marcelo-ribeiro/abd651b889e4a20e0bab558a05d38d77
  const map = {
    "-": "_",
    a: "á|à|ã|â|ä|À|Á|Ã|Â|Ä",
    e: "é|è|ê|ë|É|È|Ê|Ë",
    i: "í|ì|î|ï|Í|Ì|Î|Ï",
    o: "ó|ò|ô|õ|ö|Ó|Ò|Ô|Õ|Ö",
    u: "ú|ù|û|ü|Ú|Ù|Û|Ü",
    c: "ç|Ç",
    n: "ñ|Ñ"
  };

  for (const pattern in map) {
    str = str.replace(new RegExp(map[pattern], "g"), pattern);
  }

  return str;
};

export const slugifyMin = str => slugify(str).toLowerCase();

export const mapeiaStatusAlimento = str => {
  if (str === "Recebido") return STATUS_ALIMENTO.RECEBIDO;
  if (str === "Parcial") return STATUS_ALIMENTO.PARCIAL;
  if (str === "Não Recebido") return STATUS_ALIMENTO.NAO_RECEBIDO;
};

export const getDataHomologacao = logs => {
  const arr = filter(
    propEq("status_evento_explicacao", "CODAE homologou"),
    logs
  );
  return arr[0] ? arr[0].criado_em : "--";
};

export const gerarLinkDoItem = item => {
  const mapeamentoItens = {
    "assinado dinutre": `/${PRE_RECEBIMENTO}/${DETALHE_CRONOGRAMA}?uuid=${
      item.uuid
    }`,
    "assinado cronograma": `/${PRE_RECEBIMENTO}/${DETALHE_CRONOGRAMA}?uuid=${
      item.uuid
    }`
  };
  return mapeamentoItens[item.status.toLowerCase()];
};
