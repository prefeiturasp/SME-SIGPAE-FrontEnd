// Actions
const SET_PRODUTOS =
  "SME-Terceirizadas-Frontend/responderReclamacaoProduto/SET_PRODUTOS";
const SET_ATIVOS =
  "SME-Terceirizadas-Frontend/responderReclamacaoProduto/SET_ATIVOS";
const SET_PRODUTOS_COUNT =
  "SME-Terceirizadas-Frontend/responderReclamacaoProduto/SET_PRODUTOS_COUNT";
const SET_PAGE =
  "SME-Terceirizadas-Frontend/responderReclamacaoProduto/SET_PAGE";
const RESET = "SME-Terceirizadas-Frontend/responderReclamacaoProduto/RESET";

// Reducer
export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    case SET_PRODUTOS:
      return {
        ...state,
        produtos: action.payload,
      };
    case SET_ATIVOS:
      return {
        ...state,
        ativos: action.payload,
      };
    case SET_PRODUTOS_COUNT:
      return {
        ...state,
        produtosCount: action.payload,
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
        produtos: undefined,
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

export const setAtivos = (ativos) => ({
  type: SET_ATIVOS,
  payload: ativos,
});

export const setProdutosCount = (count) => ({
  type: SET_PRODUTOS_COUNT,
  payload: count,
});

export const setPage = (pageNumber) => ({
  type: SET_PAGE,
  payload: pageNumber,
});

export const reset = () => ({
  type: RESET,
});
