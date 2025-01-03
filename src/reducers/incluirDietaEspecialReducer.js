// Actions
const LOAD_SOLICITACOES_VIGENTES =
  "SME-SIGPAE-Frontend/incluirDietaEspecial/LOAD_SOLICITACOES_VIGENTES";

// Reducer
export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    case LOAD_SOLICITACOES_VIGENTES:
      return {
        ...state,
        solicitacoesVigentes: action.payload,
      };
    default:
      return state;
  }
}

// Action Creators
export const loadSolicitacoesVigentes = (solicitacoes) => ({
  type: LOAD_SOLICITACOES_VIGENTES,
  payload: solicitacoes,
});
