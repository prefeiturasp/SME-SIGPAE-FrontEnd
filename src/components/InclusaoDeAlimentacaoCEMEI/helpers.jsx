export const possuiAlunosCEIporPeriodo = (periodo, periodos) => {
  return periodos.find((periodo_) => periodo_.nome === periodo).CEI.length > 0;
};

export const alunosEMEIporPeriodo = (periodo, periodos) => {
  return periodos.find((periodo_) => periodo_.nome === periodo).EMEI;
};

export const tiposAlimentacaoPorPeriodoETipoUnidade = (
  vinculos,
  periodo,
  tipoUnidade
) => {
  return vinculos
    .find(
      (vinculo) =>
        vinculo.periodo_escolar.nome === periodo &&
        vinculo.tipo_unidade_escolar.iniciais.includes(tipoUnidade)
    )
    .tipos_alimentacao.filter(
      (tipo_alimentacao) =>
        tipo_alimentacao.nome.toUpperCase() !== "LANCHE EMERGENCIAL"
    )
    .map((tipo_alimentação) => tipo_alimentação.nome)
    .join(", ");
};

export const arrTiposAlimentacaoPorPeriodoETipoUnidade = (
  vinculos,
  periodo,
  tipoUnidade
) => {
  return vinculos
    .find(
      (vinculo) =>
        vinculo.periodo_escolar.nome === periodo &&
        vinculo.tipo_unidade_escolar.iniciais.includes(tipoUnidade)
    )
    .tipos_alimentacao.filter(
      (tipo_alimentacao) =>
        tipo_alimentacao.nome.toUpperCase() !== "LANCHE EMERGENCIAL"
    );
};

export const totalAlunosPorPeriodoCEI = (periodos, periodo) => {
  let totalAlunos = 0;
  return periodos
    .find((periodo_) => periodo_.nome === periodo)
    .CEI.reduce(function (total, faixa) {
      return total + faixa.quantidade_alunos;
    }, totalAlunos);
};

export const totalAlunosInputPorPeriodoCEI = (values, periodo) => {
  let totalAlunos = 0;
  const faixas = values.quantidades_periodo.find(
    (periodo_) => periodo_.nome === periodo
  ).faixas;
  if (!faixas) return 0;
  return Object.values(faixas).reduce(function (total, faixa) {
    return total + parseInt(faixa);
  }, totalAlunos);
};

export const formataInclusaoCEMEI = (values, vinculos) => {
  const inclusoes_ = values.inclusoes;
  inclusoes_.forEach((inclusao) => {
    if (inclusao.inclusao_alimentacao_cemei) {
      delete inclusao["inclusao_alimentacao_cemei"];
    }
  });
  values.dias_motivos_da_inclusao_cemei = values.inclusoes;
  values.quantidade_alunos_cei_da_inclusao_cemei = [];
  values.quantidade_alunos_emei_da_inclusao_cemei = [];
  values.quantidades_periodo
    .filter((quantidade_periodo) => quantidade_periodo.checked)
    .forEach((quantidade_periodo) => {
      if (quantidade_periodo.faixas) {
        Object.keys(quantidade_periodo.faixas).forEach((faixa) => {
          values.quantidade_alunos_cei_da_inclusao_cemei.push({
            periodo_escolar: vinculos.find(
              (vinculo) =>
                vinculo.periodo_escolar.nome === quantidade_periodo.nome
            ).periodo_escolar.uuid,
            quantidade_alunos: quantidade_periodo.faixas[faixa],
            matriculados_quando_criado: quantidade_periodo.CEI.find(
              (faixa_cei) => faixa_cei.faixa === faixa
            ).quantidade_alunos,
            faixa_etaria: quantidade_periodo.CEI.find(
              (faixa_cei) => faixa_cei.faixa === faixa
            ).uuid,
          });
        });
      }
      if (quantidade_periodo.alunos_emei) {
        values.quantidade_alunos_emei_da_inclusao_cemei.push({
          periodo_escolar: vinculos.find(
            (vinculo) =>
              vinculo.periodo_escolar.nome === quantidade_periodo.nome
          ).periodo_escolar.uuid,
          quantidade_alunos: quantidade_periodo.alunos_emei,
          matriculados_quando_criado: quantidade_periodo.EMEI
            ? quantidade_periodo.EMEI
            : "1",
          tipos_alimentacao: quantidade_periodo.tipos_alimentacao_selecionados,
        });
      }
    });

  return values;
};

export const tiposAlimentacaoMotivoEspecifico = (periodo) => {
  return periodo.tipos_alimentacao.map((ta) => ta.nome).join(", ");
};

export const validarSubmit = (values) => {
  let erro = false;

  if (
    !values.quantidades_periodo.find(
      (quantidade_periodo) => quantidade_periodo.checked
    )
  ) {
    erro = "Necessário selecionar e preencher ao menos um período";
    return erro;
  }

  if (
    values.quantidades_periodo
      .filter((quantidade_periodo) => quantidade_periodo.checked)
      .find(
        (quantidade_periodo) =>
          (!quantidade_periodo.faixas && !quantidade_periodo.alunos_emei) ||
          (quantidade_periodo.alunos_emei &&
            (!quantidade_periodo.tipos_alimentacao_selecionados ||
              !quantidade_periodo.tipos_alimentacao_selecionados?.length)) ||
          (quantidade_periodo.tipos_alimentacao_selecionados?.length &&
            !quantidade_periodo.alunos_emei)
      )
  ) {
    let erro =
      "Ao selecionar um período, preencher ao menos uma quantidade de alunos";
    if (
      values.quantidades_periodo
        .filter((quantidade_periodo) => quantidade_periodo.checked)
        .find(
          (quantidade_periodo) =>
            (quantidade_periodo.alunos_emei &&
              (!quantidade_periodo.tipos_alimentacao_selecionados ||
                !quantidade_periodo.tipos_alimentacao_selecionados?.length)) ||
            (quantidade_periodo.tipos_alimentacao_selecionados?.length &&
              !quantidade_periodo.alunos_emei)
        )
    ) {
      erro = "Selecionar alimentação e preencher quantidade de alunos";
    }
    return erro;
  }

  return erro;
};
