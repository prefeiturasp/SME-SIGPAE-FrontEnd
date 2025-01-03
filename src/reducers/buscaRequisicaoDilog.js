// Actions
const SET_REQUISICOES =
  "SME-SIGPAE-Frontend/buscaRequisicaoDilog/SET_REQUISICOES";
const SET_REQUISICOES_COUNT =
  "SME-SIGPAE-Frontend/buscaRequisicaoDilog/SET_REQUISICOES_COUNT";
const SET_ATIVOS = "SME-SIGPAE-Frontend/buscaRequisicaoDilog/SET_ATIVOS";
const SET_FILTROS = "SME-SIGPAE-Frontend/buscaRequisicaoDilog/SET_FILTROS";
const SET_PAGE = "SME-SIGPAE-Frontend/buscaRequisicaoDilog/SET_PAGE";
const RESET = "SME-SIGPAE-Frontend/buscaRequisicaoDilog/RESET";

export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    case SET_REQUISICOES:
      return {
        ...state,
        requisicoes: action.payload,
      };
    case SET_REQUISICOES_COUNT:
      return {
        ...state,
        requisicoesCount: action.payload,
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
        requisicoes: undefined,
        requisicoesCount: undefined,
      };
    default:
      return state;
  }
}

export const setRequisicoes = (listaRequisicoes) => ({
  type: SET_REQUISICOES,
  payload: listaRequisicoes,
});

export const setRequisicoesCount = (count) => ({
  type: SET_REQUISICOES_COUNT,
  payload: count,
});

export const setAtivosRequisicao = (ativos) => ({
  type: SET_ATIVOS,
  payload: ativos,
});

export const setFiltrosRequisicao = (filtros) => ({
  type: SET_FILTROS,
  payload: filtros,
});

export const setPageRequisicao = (pageNumber) => ({
  type: SET_PAGE,
  payload: pageNumber,
});

export const resetRequisicao = () => ({
  type: RESET,
});
