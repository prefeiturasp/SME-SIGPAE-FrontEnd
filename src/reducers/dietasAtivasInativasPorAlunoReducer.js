// Actions

const SET_DADOS_RESULTADOS =
  "SME-SIGPAE-Frontend/ativas-inativas/SET_DADOS_RESULTADOS";
const SET_TOTAL_RESULTADOS =
  "SME-SIGPAE-Frontend/ativas-inativas/SET_TOTAL_RESULTADOS";

const SET_EXIBIR_RESULTADOS =
  "SME-SIGPAE-Frontend/ativas-inativas/SET_EXIBIR_RESULTADOS";
const SET_FILTROS =
  "SME-SIGPAE-Frontend/dieta-especial/ativas-inativas/SET_FILTROS";

const SET_PAGE = "SME-SIGPAE-Frontend/ativas-inativas/SET_PAGE";

const SET_ESCOLAS = "SME-SIGPAE-Frontend/ativas-inativas/SET_ESCOLAS";

const SET_DIRETORIAS_REGIONAIS =
  "SME-SIGPAE-Frontend/ativas-inativas/SET_SET_DIRETORIAS_REGIONAIS";

const SET_MEUS_DADOS = "SME-SIGPAE-Frontend/ativas-inativas/SET_SET_MEUS_DADOS";

const RESET = "SME-SIGPAE-Frontend/ativas-inativas/RESET";

const initialValues = {
  filtros: undefined,
  dadosResultados: undefined,
  exibirResultados: false,
  totalResultados: 0,
  page: 1,
  escolas: [],
  diretoriasRegionais: [],
  meusDados: undefined,
};

// Reducer
export default function reducer(state = initialValues, action = {}) {
  switch (action.type) {
    case SET_DADOS_RESULTADOS:
      return {
        ...state,
        dadosResultados: action.payload,
      };
    case SET_TOTAL_RESULTADOS:
      return {
        ...state,
        totalResultados: action.payload,
      };
    case SET_EXIBIR_RESULTADOS:
      return {
        ...state,
        exibirResultados: action.payload,
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
    case SET_ESCOLAS:
      return {
        ...state,
        escolas: action.payload,
      };
    case SET_DIRETORIAS_REGIONAIS:
      return {
        ...state,
        diretoriasRegionais: action.payload,
      };
    case SET_MEUS_DADOS:
      return {
        ...state,
        meusDados: action.payload,
      };

    case RESET:
      return {
        ...state,
        ...initialValues,
      };
    default:
      return state;
  }
}

// Action Creators
export const setDadosResultados = (dadosResultados) => ({
  type: SET_DADOS_RESULTADOS,
  payload: dadosResultados,
});

export const setTotalResultados = (totalResultados) => ({
  type: SET_TOTAL_RESULTADOS,
  payload: totalResultados,
});

export const setExibirResultados = (exibirResultados) => ({
  type: SET_EXIBIR_RESULTADOS,
  payload: exibirResultados,
});

export const setFiltros = (filtros) => ({
  type: SET_FILTROS,
  payload: filtros,
});

export const setPage = (pageNumber) => ({
  type: SET_PAGE,
  payload: pageNumber,
});

export const setEscolas = (escolas) => ({
  type: SET_ESCOLAS,
  payload: escolas,
});

export const setDiretoriasRegionais = (dre) => ({
  type: SET_DIRETORIAS_REGIONAIS,
  payload: dre,
});

export const setMeusDados = (meusDados) => ({
  type: SET_MEUS_DADOS,
  payload: meusDados,
});

export const reset = () => ({
  type: RESET,
});
