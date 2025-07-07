import { get } from "lodash";

export const podeEditarProduto = (produto) => {
  const status = [
    "CODAE_PENDENTE_HOMOLOGACAO",
    "CODAE_PEDIU_ANALISE_SENSORIAL",
    "CODAE_PEDIU_ANALISE_RECLAMACAO",
    "ESCOLA_OU_NUTRICIONISTA_RECLAMOU",
    "TERCEIRIZADA_RESPONDEU_RECLAMACAO",
  ].includes(get(produto, "ultima_homologacao.status"));

  const temCopia = get(produto, "ultima_homologacao.tem_copia", false);

  return !status && !temCopia;
};
