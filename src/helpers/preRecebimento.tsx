import {
  DadosCronogramaFichaTecnica,
  FichaTecnicaSimples,
} from "src/interfaces/pre_recebimento.interface";
import { CATEGORIA_OPTIONS } from "src/components/screens/PreRecebimento/FichaTecnica/constants";

export const formatarNumeroEProdutoFichaTecnica = (
  ficha: FichaTecnicaSimples | DadosCronogramaFichaTecnica,
) => `${ficha.numero} - ${ficha.produto.nome}`;

export const ehFLV = (categoria?: string): boolean => {
  const categoriaUUID = CATEGORIA_OPTIONS.find(
    (opcao) => opcao.uuid === categoria || opcao.nome === categoria,
  )?.uuid;

  return categoriaUUID === "FLV";
};
