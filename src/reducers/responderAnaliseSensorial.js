// Actions
const SET_HOMOLOGACOES =
  "SME-SIGPAE-Frontend/responderAnaliseSensorial/SET_HOMOLOGACOES";
const SET_UUID_HOMOLOGACAO_ATIVA =
  "SME-SIGPAE-Frontend/responderAnaliseSensorial/SET_UUID_HOMOLOGACAO_ATIVA";
const SET_PAGE = "SME-SIGPAE-Frontend/responderAnaliseSensorial/SET_PAGE";
const RESET = "SME-SIGPAE-Frontend/responderAnaliseSensorial/RESET";

// Reducer
export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    case SET_HOMOLOGACOES:
      return {
        ...state,
        homologacoes: action.payload,
      };
    case SET_UUID_HOMOLOGACAO_ATIVA:
      return {
        ...state,
        uuidHomologacaoAtiva: action.payload,
      };
    case SET_PAGE:
      return {
        ...state,
        page: action.payload,
      };
    case RESET:
      return {
        ...state,
        uuidHomologacaoAtiva: undefined,
        homologacoes: undefined,
        page: undefined,
      };
    default:
      return state;
  }
}

// Action Creators
export const setHomologacoes = (listaHomologacoes) => ({
  type: SET_HOMOLOGACOES,
  payload: listaHomologacoes,
});

export const setUuidHomologacaoAtiva = (uuidHomologacaoAtiva) => ({
  type: SET_UUID_HOMOLOGACAO_ATIVA,
  payload: uuidHomologacaoAtiva,
});

export const setPage = (pageNumber) => ({
  type: SET_PAGE,
  payload: pageNumber,
});

export const reset = () => ({
  type: RESET,
});
