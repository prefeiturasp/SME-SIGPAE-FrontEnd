import {
  TIPO_SOLICITACAO,
  URL_INCLUSAO_NORMAL,
  URL_INCLUSAO_CONTINUA,
  URL_INCLUSAO_CEI,
  URL_INCLUSAO_CEMEI,
} from "../constants";

export const getPath = (tipoSolicitacao) => {
  switch (tipoSolicitacao) {
    case TIPO_SOLICITACAO.SOLICITACAO_NORMAL:
      return URL_INCLUSAO_NORMAL;
    case TIPO_SOLICITACAO.SOLICITACAO_CONTINUA:
      return URL_INCLUSAO_CONTINUA;
    case TIPO_SOLICITACAO.SOLICITACAO_CEI:
      return URL_INCLUSAO_CEI;
    case TIPO_SOLICITACAO.SOLICITACAO_CEMEI:
      return URL_INCLUSAO_CEMEI;
    default:
      console.error(
        `Unexpected value for param 'tipoSolicitacao': ${tipoSolicitacao}`
      );
      return "tipo----solicitacao----invalido";
  }
};

export const getInclusaoNome = (tipoSolicitacao, escola) => {
  const escolaLowerCase = escola.toLowerCase().replace(/\s/g, "_");
  switch (tipoSolicitacao) {
    case TIPO_SOLICITACAO.SOLICITACAO_NORMAL:
    case TIPO_SOLICITACAO.SOLICITACAO_CEI:
    case TIPO_SOLICITACAO.SOLICITACAO_CEMEI:
      return "inclusao_" + escolaLowerCase;
    case TIPO_SOLICITACAO.SOLICITACAO_CONTINUA:
      return "inclusao_continua_" + escolaLowerCase;
    default:
      return "inclusao_alimentacao";
  }
};
