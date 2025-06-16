const LOAD_PRODUTO = "LOAD_PRODUTO";

export default function reducer(state = {}, action) {
  switch (action.type) {
    case LOAD_PRODUTO:
      if (action.data !== null) {
        action.data.eh_para_alunos_com_dieta = action.data
          .eh_para_alunos_com_dieta
          ? "1"
          : "0";
        action.data.tem_aditivos_alergenicos = action.data
          .tem_aditivos_alergenicos
          ? "1"
          : "0";
        if (![null, undefined].includes(action.data.tem_gluten)) {
          action.data.tem_gluten = action.data.tem_gluten ? "1" : "0";
        }
        action.data.marca =
          action.data.marca !== null ? action.data.marca.nome : "";
        action.data.fabricante =
          action.data.fabricante !== null ? action.data.fabricante.nome : "";
        if (
          action.data.especificacoes &&
          action.data.especificacoes.length > 0
        ) {
          action.data.especificacoes = action.data.especificacoes.map(
            (especificacao) => {
              return {
                volume: especificacao.volume,
                unidade_de_medida: especificacao.unidade_de_medida.uuid,
                embalagem_produto: especificacao.embalagem_produto.uuid,
              };
            }
          );
        } else {
          action.data.especificacoes = [{}];
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

export const loadProduto = (data) => (dispatch) =>
  dispatch({ type: LOAD_PRODUTO, data });
