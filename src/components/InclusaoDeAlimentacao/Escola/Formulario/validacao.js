import {
  usuarioEhEscolaCeuGestao,
  usuarioEhEscolaCMCT,
} from "helpers/utilities";

export const validarSubmissaoNormal = (
  values,
  meusDados,
  ehMotivoEspecifico
) => {
  if (!values.quantidades_periodo.find((qp) => qp.checked))
    return "Necessário selecionar ao menos um período";

  let totalAlunos = 0;

  const periodosSemTipoAlimentacao = [];

  values.quantidades_periodo
    .filter((qp) => qp.checked)
    .forEach((quantidade_periodo) => {
      totalAlunos += parseInt(quantidade_periodo.numero_alunos);
      if (quantidade_periodo.tipos_alimentacao_selecionados.length === 0) {
        periodosSemTipoAlimentacao.push(quantidade_periodo.nome);
      }
    });

  if (periodosSemTipoAlimentacao.length > 0) {
    return `Selecione ao menos um tipo de alimentação no(s) período(s) ${String(
      periodosSemTipoAlimentacao
    )}`;
  }

  if (
    !usuarioEhEscolaCeuGestao() &&
    !usuarioEhEscolaCMCT() &&
    !ehMotivoEspecifico &&
    meusDados.vinculo_atual.instituicao.quantidade_alunos < totalAlunos
  ) {
    return "Número total de alunos do pedido ultrapassa quantidade de alunos da escola";
  }
  return false;
};

export const validarSubmissaoContinua = (
  values,
  meusDados,
  ehMotivoEspecifico
) => {
  if (!values.quantidades_periodo)
    return "Necessário adicionar ao menos uma recorrência";

  let totalAlunos = 0;

  values.quantidades_periodo.forEach((quantidade_periodo) => {
    totalAlunos += parseInt(quantidade_periodo.numero_alunos);
  });

  if (
    !values.quantidades_periodo.find((qp) => qp.nome === "NOITE") &&
    !usuarioEhEscolaCeuGestao() &&
    !usuarioEhEscolaCMCT()
  ) {
    if (
      !ehMotivoEspecifico &&
      meusDados.vinculo_atual.instituicao.quantidade_alunos < totalAlunos
    )
      return "Número total de alunos do pedido ultrapassa quantidade de alunos da escola";
  }

  return false;
};
