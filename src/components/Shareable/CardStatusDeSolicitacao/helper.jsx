import {
  INVERSAO_CARDAPIO,
  INCLUSAO_ALIMENTACAO,
  SOLICITACAO_KIT_LANCHE,
  ALTERACAO_TIPO_ALIMENTACAO,
} from "../../../configs/constants";

export const caminhoURL = (tipoDeSolicitacao) => {
  switch (tipoDeSolicitacao) {
    case "INV_CARDAPIO":
      return INVERSAO_CARDAPIO;
    case "INC_ALIMENTA":
    case "INC_ALIMENTA_CONTINUA":
      return INCLUSAO_ALIMENTACAO;
    case "KIT_LANCHE_AVULSA":
      return SOLICITACAO_KIT_LANCHE;
    case "ALT_CARDAPIO":
      return ALTERACAO_TIPO_ALIMENTACAO;
    default:
      return tipoDeSolicitacao;
  }
};
