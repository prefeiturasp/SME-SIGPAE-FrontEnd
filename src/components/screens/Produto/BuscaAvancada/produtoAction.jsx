import {
  getTodosOsProdutos,
  getNomesProdutos,
  getNomesMarcas,
  getNomesFabricantes,
  getInformacoesGrupo,
} from "../../../../services/produto.service";
import { retornaProdutosComUltimaHomolagacao } from "./helpers";

export const buscaProdutos = async () => {
  const response = await getTodosOsProdutos();
  const produtos = retornaProdutosComUltimaHomolagacao(response);
  return {
    type: "PRODUTOS_SEARCH",
    payload: produtos,
  };
};

export const buscaNomesProduto = async () => {
  const response = await getNomesProdutos();
  return {
    type: "NOMES_PRODUTOS",
    payload: response,
  };
};

export const buscaNomesMarcas = async () => {
  const response = await getNomesMarcas();
  return {
    type: "NOMES_MARCAS",
    payload: response,
  };
};

export const buscaNomesFabricantes = async () => {
  const response = await getNomesFabricantes();
  return {
    type: "NOMES_FABRICANTES",
    payload: response,
  };
};

export const setaProdutoRelatorio = async (produto) => {
  return {
    type: "PRODUTO_RELATORIO",
    payload: produto,
  };
};

export const setaProdutosFiltrados = async (retornoProdutos) => {
  return {
    type: "PRODUTO_FILTRADO",
    payload: retornoProdutos,
  };
};

export const buscaInformacoesNutricionais = async () => {
  const response = getInformacoesGrupo();
  return {
    type: "INFORMACOES_NUTRICIONAIS",
    payload: response,
  };
};
