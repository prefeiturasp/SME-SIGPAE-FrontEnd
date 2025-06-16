//actions
export const UPDATE_STATUS = "UPDATE_STATUS";
export const UPDATE_TITULO_DIETA = "UPDATE_TITULO_DIETA";
export const UPDATE_LOTE = "UPDATE_LOTE";
export const RESET_CAMPOS = "RESET_CAMPOS";

export const updateStatusDieta = (status) => ({
  type: UPDATE_STATUS,
  payload: status,
});

export const updateTituloDieta = (titulo) => ({
  type: UPDATE_TITULO_DIETA,
  payload: titulo,
});

export const updateLoteDieta = (lote) => ({
  type: UPDATE_LOTE,
  payload: lote,
});

export const resetCamposDieta = () => {
  return {
    type: RESET_CAMPOS,
  };
};

const initialState = {
  statusDieta: "",
  tituloDieta: "",
  loteDieta: "",
};

//reducer
export const filtersDietaReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_STATUS:
      return {
        ...state,
        statusDieta: action.payload,
      };
    case UPDATE_TITULO_DIETA:
      return {
        ...state,
        tituloDieta: action.payload,
      };
    case UPDATE_LOTE:
      return {
        ...state,
        loteDieta: action.payload,
      };
    case RESET_CAMPOS:
      return {
        ...state,
        statusDieta: "",
        tituloDieta: "",
        loteDieta: "",
      };
    default:
      return state;
  }
};
