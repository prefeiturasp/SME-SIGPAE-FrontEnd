import { usuarioEhEscola } from "src/helpers/utilities";
import {
  URL_KIT_LANCHES_SOLICITACOES_AVULSA,
  URL_KIT_LANCHES_SOLICITACOES_CEI,
  URL_KIT_LANCHES_SOLICITACOES_CEMEI,
  TIPO_SOLICITACAO,
} from "src/services/constants";

export const getPath = (tipoSolicitacao) => {
  switch (tipoSolicitacao) {
    case TIPO_SOLICITACAO.SOLICITACAO_NORMAL:
      return URL_KIT_LANCHES_SOLICITACOES_AVULSA;
    case TIPO_SOLICITACAO.SOLICITACAO_CEI:
      return URL_KIT_LANCHES_SOLICITACOES_CEI;
    case TIPO_SOLICITACAO.SOLICITACAO_CEMEI:
      return URL_KIT_LANCHES_SOLICITACOES_CEMEI;
    default:
      console.log(
        `Unexpected value for param 'tipoSolicitacao': ${tipoSolicitacao}`
      );
      return "tipo----solicitacao----invalido";
  }
};

export const getKitLancheNome = (tipoSolicitacao, escola) => {
  const escolaLowerCase = escola.toLowerCase().replace(/\s/g, "_");
  switch (tipoSolicitacao) {
    case TIPO_SOLICITACAO.SOLICITACAO_NORMAL:
    case TIPO_SOLICITACAO.SOLICITACAO_CEI:
    case TIPO_SOLICITACAO.SOLICITACAO_CEMEI:
      return "kit_lanche_" + escolaLowerCase;
    default:
      return "solicitacao_kit_lanche";
  }
};

export const getKitLancheUnificadoNome = () => {
  if (usuarioEhEscola()) {
    const escolaLowerCase = localStorage
      .getItem("nome_instituicao")
      .toLowerCase()
      .replace(/\s/g, "_");
    return "kit_lanche_unificado_" + escolaLowerCase;
  } else {
    return "kit_lanche_unificado";
  }
};
