const LOAD_PRODUTO = "LOAD_PRODUTO";

const formatarEspecificacoes = (especificacoes) => {
  if (!especificacoes || especificacoes.length === 0) {
    return [{}];
  }
  return especificacoes.map((especificacao) => {
    return {
      volume: especificacao.volume,
      unidade_de_medida: especificacao.unidade_de_medida.uuid,
      embalagem_produto: especificacao.embalagem_produto.uuid,
    };
  });
};

const formatarDadosDoProduto = (data) => {
  if (data === null) {
    return;
  }
  data.eh_para_alunos_com_dieta = data.eh_para_alunos_com_dieta ? "1" : "0";
  data.tem_aditivos_alergenicos = data.tem_aditivos_alergenicos ? "1" : "0";
  if (![null, undefined].includes(data.tem_gluten)) {
    data.tem_gluten = data.tem_gluten ? "1" : "0";
  }
  data.marca = data.marca !== null ? data.marca.nome : "";
  data.fabricante = data.fabricante !== null ? data.fabricante.nome : "";
  data.especificacoes = formatarEspecificacoes(data.especificacoes);
};

export default function reducer(state = {}, action) {
  switch (action.type) {
    case LOAD_PRODUTO:
      formatarDadosDoProduto(action.data);
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
