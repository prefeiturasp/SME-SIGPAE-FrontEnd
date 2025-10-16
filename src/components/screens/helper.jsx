import {
  ALTERACAO_TIPO_ALIMENTACAO,
  ALTERACAO_TIPO_ALIMENTACAO_CEMEI,
  DIETA_ESPECIAL,
  INCLUSAO_ALIMENTACAO,
  INCLUSAO_ALIMENTACAO_CEMEI,
  INVERSAO_CARDAPIO,
  RELATORIO,
  SOLICITACAO_KIT_LANCHE,
  SOLICITACAO_KIT_LANCHE_CEMEI,
  SOLICITACAO_KIT_LANCHE_UNIFICADA,
  SUSPENSAO_ALIMENTACAO,
  SUSPENSAO_ALIMENTACAO_CEI,
} from "../../configs/constants";
import {
  truncarString,
  usuarioEhCoordenadorNutriCODAE,
  usuarioEhEscolaTerceirizada,
  usuarioEhEscolaTerceirizadaDiretor,
} from "../../helpers/utilities";
import { TIPO_PERFIL, TIPO_SOLICITACAO } from "src/constants/shared";
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
  NUTRISUPERVISAO: 4,
};

export const ajustarFormatoLog = (logs, card) => {
  return logs.map((log) => {
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
          log.escolas_quantidades[0].cancelado_por.tipo_usuario,
        )
      ) {
        date = log.escolas_quantidades[0].cancelado_em;
      }
      return date;
    };

    const card_ =
      card === "pendente" && usuarioEhCoordenadorNutriCODAE()
        ? "pendentes-aut"
        : card;

    const getTextCard = () => {
      let text = "";
      if (
        usuarioEhEscolaTerceirizadaDiretor() ||
        usuarioEhEscolaTerceirizada()
      ) {
        text =
          truncarString(descricao, tamanhoString) +
          (log.serie ? " - " + log.serie : "");
      } else if (
        ["pendentes-aut", "pendente"].includes(card) &&
        usuarioEhCoordenadorNutriCODAE()
      ) {
        text =
          log.dre_iniciais +
          " - " +
          truncarString(descricao, tamanhoString) +
          " / " +
          log.escola_nome;
      } else {
        text =
          truncarString(descricao, tamanhoString) + " / " + log.escola_nome;
      }
      return text;
    };

    return {
      text: getTextCard(),
      conferido: log.conferido || log.terceirizada_conferiu_gestao,
      lote_uuid: log.lote_uuid,
      date: getDate(),
      link: `/${solicitacao}/${RELATORIO}?uuid=${log.uuid}&ehInclusaoContinua=${
        log.tipo_doc === INC_ALIMENTA_CONTINUA
      }&tipoSolicitacao=${tipo}&card=${card_}`,
      tipo_solicitacao_dieta: log?.tipo_solicitacao_dieta,
    };
  });
};

export const slugify = (str) => {
  // Function from https://gist.github.com/marcelo-ribeiro/abd651b889e4a20e0bab558a05d38d77
  const map = {
    "-": "_",
    a: "á|à|ã|â|ä|À|Á|Ã|Â|Ä",
    e: "é|è|ê|ë|É|È|Ê|Ë",
    i: "í|ì|î|ï|Í|Ì|Î|Ï",
    o: "ó|ò|ô|õ|ö|Ó|Ò|Ô|Õ|Ö",
    u: "ú|ù|û|ü|Ú|Ù|Û|Ü",
    c: "ç|Ç",
    n: "ñ|Ñ",
  };

  for (const pattern in map) {
    str = str.replace(new RegExp(map[pattern], "g"), pattern);
  }

  return str;
};

export const slugifyMin = (str) => slugify(str).toLowerCase();

export const mapeiaStatusAlimento = (str) => {
  if (str === "Recebido") return STATUS_ALIMENTO.RECEBIDO;
  if (str === "Parcial") return STATUS_ALIMENTO.PARCIAL;
  if (str === "Não Recebido") return STATUS_ALIMENTO.NAO_RECEBIDO;
};

export const getDataHomologacao = (logs) => {
  const homolog = logs.find(
    (log) => log.status_evento_explicacao === "CODAE homologou",
  );
  return homolog ? homolog.criado_em : "--";
};

export const deParaStatusAltCronograma = (status) =>
  [
    "Cronograma ciente",
    "Aprovado Abastecimento",
    "Reprovado Abastecimento",
  ].includes(status)
    ? "Em análise"
    : ["Alteração Enviada ao Fornecedor"].includes(status)
      ? "Recebida Alteração da CODAE"
      : status;

export const formatarPara4Digitos = (numero) => {
  let numeroFormatado = numero.toString();
  if (numeroFormatado.length === 1) {
    numeroFormatado = "000" + numeroFormatado;
  } else if (numeroFormatado.length === 2) {
    numeroFormatado = "00" + numeroFormatado;
  } else if (numeroFormatado.length === 3) {
    numeroFormatado = "0" + numeroFormatado;
  } else {
    numeroFormatado = numero;
  }
  return numeroFormatado;
};

export const MSG_SENHA_INVALIDA = () => (
  <>
    <strong>Senha Inválida:</strong> Em caso de esquecimento de senha, solicite
    a recuperação e tente novamente.
  </>
);

export const formataValorDecimal = (value) => {
  if (value === null || value === undefined || value === "") return "";

  const str = `${value}`;
  const parts = str.split(".");
  let int = parts[0];
  let decimal = parts.length > 1 ? parts[1] : "";

  const n = Number(int);
  const formatted = n.toLocaleString("pt-BR");

  decimal = decimal.slice(0, 2);

  return decimal ? `${formatted},${decimal}` : formatted;
};

export const parserValorDecimal = (value) => {
  if (!value) return "";
  return Number.parseFloat(
    value.replace(/\$\s?|(\.*)/g, "").replace(/(,{1})/g, "."),
  ).toFixed(2);
};
