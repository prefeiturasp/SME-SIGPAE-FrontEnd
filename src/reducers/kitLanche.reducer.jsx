const LOAD_ALUNOS_POR_FAIXA_ETARIA = "LOAD_ALUNOS_POR_FAIXA_ETARIA";
const SET_TOTAL_ALUNOS_SELECIONADOS = "SET_TOTAL_ALUNOS_SELECIONADOS";

export default function reducer(state = {}, action) {
  switch (action.type) {
    case LOAD_ALUNOS_POR_FAIXA_ETARIA:
      return Object.assign({}, state, {
        alunosPorFaixaEtaria: action.data,
      });
    case SET_TOTAL_ALUNOS_SELECIONADOS:
      return Object.assign({}, state, {
        totalAlunosSelecionadosCei: action.data,
      });
    default:
      return state;
  }
}
