const LOAD_FILTRO_BUSCA = "LOAD_FILTRO_BUSCA";

export default function reducer(state = {}, action) {
  switch (action.type) {
    case LOAD_FILTRO_BUSCA:
      return {
        data: {
          ...action.data,
        },
      };
    default:
      return state;
  }
}

export const loadFiltroBusca = (data) => (dispatch) =>
  dispatch({ type: LOAD_FILTRO_BUSCA, data });
