const validate = (values) => {
  const errors = {};
  if (
    !values.especificacoes ||
    (values.especificacoes.length === 1 &&
      !Object.keys(values.especificacoes[0]).length)
  ) {
    errors.especificacoes = {
      _error: "Os campos de especificações são obrigatórios",
    };
  } else {
    const especificacoesArrayErrors = [];
    values.especificacoes.forEach((especificacao, especificacaoIndex) => {
      const especificacaoErrors = {};
      if (!especificacao || !especificacao.volume) {
        especificacaoErrors.volume = "Campo obrigatório";
        especificacoesArrayErrors[especificacaoIndex] = especificacaoErrors;
      }
      if (
        !especificacao ||
        !especificacao.unidade_de_medida ||
        especificacao.unidade_de_medida === "Selecione a Unidade de Medida"
      ) {
        especificacaoErrors.unidade_de_medida = "Campo obrigatório";
        especificacoesArrayErrors[especificacaoIndex] = especificacaoErrors;
      }
      if (
        !especificacao ||
        !especificacao.embalagem_produto ||
        especificacao.embalagem_produto === "Selecione a Embalagem"
      ) {
        especificacaoErrors.embalagem_produto = "Campo obrigatório";
        especificacoesArrayErrors[especificacaoIndex] = especificacaoErrors;
      }
    });
    if (especificacoesArrayErrors.length) {
      errors.especificacoes = especificacoesArrayErrors;
    }
  }
  return errors;
};

export default validate;
