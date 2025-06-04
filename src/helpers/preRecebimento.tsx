import {
  DadosCronogramaFichaTecnica,
  FichaTecnicaSimples,
} from "interfaces/pre_recebimento.interface";

export const formatarNumeroEProdutoFichaTecnica = (
  ficha: FichaTecnicaSimples | DadosCronogramaFichaTecnica
) => `${ficha.numero} - ${ficha.produto.nome}`;
