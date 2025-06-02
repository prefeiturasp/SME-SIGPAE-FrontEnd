const LOAD_TIPO_ALIMENTACAO = "LOAD_TIPO_ALIMENTACAO";

export default function reducer(state = {}, action) {
  switch (action.type) {
    case LOAD_TIPO_ALIMENTACAO:
      if (action.data) {
        action.data.tipos_unidades = action.data.tipos_unidades
          ? action.data.tipos_unidades.uuid
          : null;
      }
      return {
        data: {
          ...action.data,
        },
      };
    default:
      return state;
  }
}

export const loadTipoAlimentacao = (data) => (dispatch) =>
  dispatch({ type: LOAD_TIPO_ALIMENTACAO, data });
