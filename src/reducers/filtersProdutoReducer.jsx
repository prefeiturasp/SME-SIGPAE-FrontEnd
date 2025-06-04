//actions
export const UPDATE_MARCA = "UPDATE_MARCA";
export const UPDATE_NOME = "UPDATE_NOME";
export const UPDATE_EDITAL = "UPDATE_EDITAL";
export const RESET_CAMPOS_PRODUTO = "RESET_CAMPOS_PRODUTO";

export const updateMarcaProduto = (marca) => ({
  type: UPDATE_MARCA,
  payload: marca,
});

export const updateNomeProduto = (nome) => ({
  type: UPDATE_NOME,
  payload: nome,
});

export const updateEditalProduto = (edital) => ({
  type: UPDATE_EDITAL,
  payload: edital,
});

export const resetCamposProduto = () => {
  return {
    type: RESET_CAMPOS_PRODUTO,
  };
};

const initialState = {
  marcaProduto: "",
  nomeProduto: "",
  editalProduto: "",
};

//reducer
export const filtersProdutoReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_MARCA:
      return {
        ...state,
        marcaProduto: action.payload,
      };
    case UPDATE_NOME:
      return {
        ...state,
        nomeProduto: action.payload,
      };
    case UPDATE_EDITAL:
      return {
        ...state,
        editalProduto: action.payload,
      };
    case RESET_CAMPOS_PRODUTO:
      return {
        ...state,
        marcaProduto: "",
        nomeProduto: "",
        editalProduto: "",
      };
    default:
      return state;
  }
};
