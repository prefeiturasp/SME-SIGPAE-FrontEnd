// Actions
const SET_PRODUTOS =
  "SME-SIGPAE-Frontend/avaliarReclamacaoProduto/SET_PRODUTOS";
const SET_PRODUTOS_COUNT =
  "SME-SIGPAE-Frontend/avaliarReclamacaoProduto/SET_PRODUTOS_COUNT";
const SET_INDICE_PRODUTO_ATIVO =
  "SME-SIGPAE-Frontend/avaliarReclamacaoProduto/SET_INDICE_PRODUTO_ATIVO";
const SET_PAGE = "SME-SIGPAE-Frontend/avaliarReclamacaoProduto/SET_PAGE";
const RESET = "SME-SIGPAE-Frontend/avaliarReclamacaoProduto/RESET";

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
    case SET_INDICE_PRODUTO_ATIVO:
      return {
        ...state,
        indiceProdutoAtivo: action.payload,
      };
    case SET_PAGE:
      return {
        ...state,
        page: action.payload,
      };
    case RESET:
      return {
        ...state,
        indiceProdutoAtivo: undefined,
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

export const setIndiceProdutoAtivo = (indiceProdutoAtivo) => ({
  type: SET_INDICE_PRODUTO_ATIVO,
  payload: indiceProdutoAtivo,
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
