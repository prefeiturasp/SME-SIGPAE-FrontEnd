//actions
export const UPDATE_TITULO_ALIMENTACAO = "UPDATE_TITULO_ALIMENTACAO";
export const UPDATE_LOTE = "UPDATE_LOTE";
export const UPDATE_STATUS = "UPDATE_STATUS";
export const UPDATE_TIPO_SOLICITACAO = "UPDATE_TIPO_SOLICITACAO";
export const UPDATE_DATA_EVENTO = "UPDATE_DATA_EVENTO";
export const UPDATE_DRE = "UPDATE_DRE";
export const RESET_CAMPOS = "RESET_CAMPOS";

export const updateTituloAlimentacao = (titulo) => ({
  type: UPDATE_TITULO_ALIMENTACAO,
  payload: titulo,
});

export const updateStatusAlimentacao = (status) => ({
  type: UPDATE_STATUS,
  payload: status,
});

export const updateLoteAlimentacao = (lote) => ({
  type: UPDATE_LOTE,
  payload: lote,
});

export const updateTipoSolicitacaoAlimentacao = (tipo_solicitacao) => ({
  type: UPDATE_TIPO_SOLICITACAO,
  payload: tipo_solicitacao,
});

export const updateDREAlimentacao = (diretoria_regional) => ({
  type: UPDATE_DRE,
  payload: diretoria_regional,
});

export const updateDataEventoAlimentacao = (data_evento) => ({
  type: UPDATE_DATA_EVENTO,
  payload: data_evento,
});

export const resetCamposAlimentacao = () => {
  return {
    type: RESET_CAMPOS,
  };
};

const initialState = {
  tituloAlimentacao: "",
  statusAlimentacao: "",
  loteAlimentacao: "",
  tipoSolicitacaoAlimentacao: "",
  dataEventoAlimentacao: "",
  dreAlimentacao: "",
};

//reducer
export const filtersAlimentacaoReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_STATUS:
      return {
        ...state,
        statusAlimentacao: action.payload,
      };
    case UPDATE_TITULO_ALIMENTACAO:
      return {
        ...state,
        tituloAlimentacao: action.payload,
      };
    case UPDATE_LOTE:
      return {
        ...state,
        loteAlimentacao: action.payload,
      };
    case UPDATE_TIPO_SOLICITACAO:
      return {
        ...state,
        tipoSolicitacaoAlimentacao: action.payload,
      };
    case UPDATE_DATA_EVENTO:
      return {
        ...state,
        dataEventoAlimentacao: action.payload,
      };
    case UPDATE_DRE:
      return {
        ...state,
        dreAlimentacao: action.payload,
      };
    case RESET_CAMPOS:
      return {
        ...state,
        tituloAlimentacao: "",
        statusAlimentacao: "",
        loteAlimentacao: "",
        tipoSolicitacaoAlimentacao: "",
        dataEventoAlimentacao: "",
        dreAlimentacao: "",
      };
    default:
      return state;
  }
};
