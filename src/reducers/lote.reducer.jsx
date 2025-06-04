const LOAD_LOTE = "LOAD_LOTE";

export default function reducer(state = {}, action) {
  switch (action.type) {
    case LOAD_LOTE:
      if (action.data) {
        action.data.diretoria_regional = action.data.diretoria_regional
          ? action.data.diretoria_regional.uuid
          : null;
        action.data.tipo_gestao = action.data.tipo_gestao
          ? action.data.tipo_gestao.uuid
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

export const loadLote = (data) => (dispatch) =>
  dispatch({ type: LOAD_LOTE, data });
