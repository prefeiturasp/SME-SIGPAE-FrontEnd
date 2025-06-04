const LOAD_INVERSAO_DIA_CARDAPIO = "LOAD_INVERSAO_DIA_CARDAPIO";

export default function reducer(state = {}, action) {
  switch (action.type) {
    case LOAD_INVERSAO_DIA_CARDAPIO:
      if (action.data !== null) {
        action.data.data_de = action.data.cardapio_de
          ? action.data.cardapio_de.data
          : action.data.data_de_inversao;
        action.data.data_para = action.data.cardapio_para
          ? action.data.cardapio_para.data
          : action.data.data_para_inversao;

        action.data.data_de_2 = action.data.data_de_inversao_2;
        action.data.data_para_2 = action.data.data_para_inversao_2;
        if (action.data.tipos_alimentacao) {
          action.data.tipos_alimentacao = action.data.tipos_alimentacao.map(
            (tipoAlimentacao) => {
              return tipoAlimentacao.uuid;
            }
          );
        }
        if (action.data.alunos_da_cemei === "Todos") {
          action.data.alunos_da_cemei = ["CEI", "EMEI"];
        }
        if (action.data.alunos_da_cemei === "CEI") {
          action.data.alunos_da_cemei = ["CEI"];
        }
        if (action.data.alunos_da_cemei === "EMEI") {
          action.data.alunos_da_cemei = ["EMEI"];
        }
        if (action.data.alunos_da_cemei_2 === "Todos") {
          action.data.alunos_da_cemei_2 = ["CEI", "EMEI"];
        }
        if (action.data.alunos_da_cemei_2 === "CEI") {
          action.data.alunos_da_cemei_2 = ["CEI"];
        }
        if (action.data.alunos_da_cemei_2 === "EMEI") {
          action.data.alunos_da_cemei_2 = ["EMEI"];
        }
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

export const loadInversaoDeDiaDeCardapio = (data) => (dispatch) =>
  dispatch({ type: LOAD_INVERSAO_DIA_CARDAPIO, data });
