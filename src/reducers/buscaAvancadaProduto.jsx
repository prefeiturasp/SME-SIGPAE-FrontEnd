// Actions
const SET_PRODUTOS = "SME-SIGPAE-Frontend/buscaAvancadaProduto/SET_PRODUTOS";
const SET_PRODUTOS_COUNT =
  "SME-SIGPAE-Frontend/buscaAvancadaProduto/SET_PRODUTOS_COUNT";
const SET_ATIVOS = "SME-SIGPAE-Frontend/buscaAvancadaProduto/SET_ATIVOS";
const SET_FILTROS = "SME-SIGPAE-Frontend/buscaAvancadaProduto/SET_FILTROS";
const SET_PAGE = "SME-SIGPAE-Frontend/buscaAvancadaProduto/SET_PAGE";
const RESET = "SME-SIGPAE-Frontend/buscaAvancadaProduto/RESET";

// Reducer
export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    case SET_PRODUTOS:
      return {
        ...state,
        produtos: action.payload,
      };
    case SET_PRODUTOS_COUNT:
      return {
        ...state,
        produtosCount: action.payload,
      };
    case SET_ATIVOS:
      return {
        ...state,
        ativos: action.payload,
      };
    case SET_FILTROS:
      return {
        ...state,
        filtros: action.payload,
      };
    case SET_PAGE:
      return {
        ...state,
        page: action.payload,
      };
    case RESET:
      return {
        ...state,
        ativos: undefined,
        filtros: undefined,
        homologacoes: undefined,
        produtos: undefined,
        produtosCount: undefined,
      };
    default:
      return state;
  }
}

// Action Creators
export const setProdutos = (listaProdutos) => ({
  type: SET_PRODUTOS,
  payload: listaProdutos,
});

export const setProdutosCount = (count) => ({
  type: SET_PRODUTOS_COUNT,
  payload: count,
});

export const setAtivos = (ativos) => ({
  type: SET_ATIVOS,
  payload: ativos,
});

export const setFiltros = (filtros) => ({
  type: SET_FILTROS,
  payload: filtros,
});

export const setPage = (pageNumber) => ({
  type: SET_PAGE,
  payload: pageNumber,
});

export const reset = () => ({
  type: RESET,
});
