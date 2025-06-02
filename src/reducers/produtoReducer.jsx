const initialState = {
  list: [],
  nomesProdutos: [],
  nomesMarcas: [],
  nomesFabricantes: [],
  produtoRelatorio: {},
  produtosFiltrados: [],
  informacoesNutricionais: [],
};

export const produtoReducer = (state = initialState, action) => {
  switch (action.type) {
    case "PRODUTOS_SEARCH":
      return {
        ...state,
        list: action.payload,
      };
    case "NOMES_PRODUTOS":
      return {
        ...state,
        nomesProdutos: action.payload.data.results.map((res) => {
          return res.nome;
        }),
      };
    case "NOMES_MARCAS":
      return {
        ...state,
        nomesMarcas: action.payload.data.results.map((res) => {
          return res.nome;
        }),
      };
    case "NOMES_FABRICANTES":
      return {
        ...state,
        nomesFabricantes: action.payload.data.results.map((res) => {
          return res.nome;
        }),
      };
    case "PRODUTO_RELATORIO":
      return {
        ...state,
        produtoRelatorio: action.payload,
      };
    case "PRODUTO_FILTRADO":
      return {
        ...state,
        produtosFiltrados: action.payload,
      };
    case "INFORMACOES_NUTRICIONAIS":
      return {
        ...state,
        informacoesNutricionais: action.payload.data.results.map((res) => {
          res["ativo"] = false;
          return res;
        }),
      };
    default:
      return state;
  }
};
