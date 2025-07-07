import {
  DadosCronogramaFichaTecnica,
  FichaTecnicaSimples,
} from "src/interfaces/pre_recebimento.interface";

export const formatarNumeroEProdutoFichaTecnica = (
  ficha: FichaTecnicaSimples | DadosCronogramaFichaTecnica
) => `${ficha.numero} - ${ficha.produto.nome}`;
