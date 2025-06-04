import { ENDPOINT_HOMOLOGACOES_PRODUTO_STATUS } from "../../constants/shared";

export const escolheStatusPendenteHomologacao = () => {
  return ENDPOINT_HOMOLOGACOES_PRODUTO_STATUS.CODAE_PENDENTE_HOMOLOGACAO;
};

export const escolheStatusAguardandoAnaliseReclamacao = () => {
  return ENDPOINT_HOMOLOGACOES_PRODUTO_STATUS.CODAE_PEDIU_ANALISE_RECLAMACAO;
};
