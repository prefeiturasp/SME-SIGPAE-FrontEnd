import moment from "moment";

const temHorariosDeAlimentacaoCadastrado = (horarioDosAlimentos) => {
  return horarioDosAlimentos.length > 0;
};

const montarArrayHorariosIniciais = (vinculo, uuidEscola, uuidPeriodo) => {
  let arrayDosHorarios = [];
  vinculo.tipos_alimentacao.forEach((tipo_alimentacao) => {
    arrayDosHorarios.push({
      uuid: null,
      tipo_alimentacao: tipo_alimentacao.uuid,
      escola: uuidEscola,
      periodo_escolar: uuidPeriodo,
      hora_inicial: "00:00",
      hora_final: "00:00",
      label: tipo_alimentacao.nome,
    });
  });
  return arrayDosHorarios;
};

const alimentoPossuiHorario = (tipo_alimentacao, horarioDosAlimentos) => {
  return horarioDosAlimentos.find(
    (horario) => horario.tipo_alimentacao.uuid === tipo_alimentacao.uuid
  );
};

const montaArrayHorarios = (
  vinculo,
  horarioDosAlimentos,
  uuidEscola,
  uuidPeriodo
) => {
  let arrayDosHorarios = [];
  vinculo.tipos_alimentacao.forEach((tipo_alimentacao) => {
    let horario = alimentoPossuiHorario(tipo_alimentacao, horarioDosAlimentos);
    if (horario) {
      arrayDosHorarios.push({
        uuid: horario.uuid,
        tipo_alimentacao: horario.tipo_alimentacao.uuid,
        escola: horario.escola.uuid,
        periodo_escolar: horario.periodo_escolar.uuid,
        hora_inicial: horario.hora_inicial,
        hora_final: horario.hora_final,
        label: horario.tipo_alimentacao.nome,
      });
    } else {
      arrayDosHorarios.push({
        uuid: null,
        tipo_alimentacao: tipo_alimentacao.uuid,
        escola: uuidEscola,
        periodo_escolar: uuidPeriodo,
        hora_inicial: "00:00",
        hora_final: "00:00",
        label: tipo_alimentacao.nome,
      });
    }
  });
  return arrayDosHorarios;
};

const obtemQuantidadeDeAlunosPeloPeriodoEscolar = (
  uuidPeriodo,
  periodosEQuantidadeAlunos
) => {
  let periodo_alunos = {
    uuid: null,
    quantidade_alunos_anterior: 0,
    quantidade_alunos: 0,
    justificativa: null,
    escola: null,
    periodo_escolar: null,
    ativo: true,
  };
  periodosEQuantidadeAlunos.forEach((periodo) => {
    if (periodo.periodo_escolar.uuid === uuidPeriodo) {
      periodo_alunos.quantidade_alunos_anterior = periodo.quantidade_alunos;
      periodo_alunos.escola = periodo.escola.uuid;
      periodo_alunos.periodo_escolar = periodo.periodo_escolar.uuid;
      periodo_alunos.uuid = periodo.uuid;
    }
  });
  return periodo_alunos;
};

const montaVinculosDeHorariosIniciais = (
  vinculosPeriodoEscolarUnidadeEscolar,
  uuidEscola,
  periodosEQuantidadeAlunos
) => {
  let arrayVinculos = [];
  vinculosPeriodoEscolarUnidadeEscolar.forEach((vinculo) => {
    const info_alunos = obtemQuantidadeDeAlunosPeloPeriodoEscolar(
      vinculo.periodo_escolar.uuid,
      periodosEQuantidadeAlunos
    );
    arrayVinculos.push({
      ativo: false,
      periodo_escolar: vinculo.periodo_escolar,
      horarios_alimentacao: montarArrayHorariosIniciais(
        vinculo,
        uuidEscola,
        vinculo.periodo_escolar.uuid
      ),
      quantidade_alunos: info_alunos,
    });
  });
  return arrayVinculos;
};

const montaVinculosDeHorariosExistentes = (
  vinculosPeriodoEscolarUnidadeEscolar,
  horarioDosAlimentos,
  uuidEscola,
  periodosEQuantidadeAlunos
) => {
  let arrayVinculos = [];
  vinculosPeriodoEscolarUnidadeEscolar.forEach((vinculo) => {
    const info_alunos = obtemQuantidadeDeAlunosPeloPeriodoEscolar(
      vinculo.periodo_escolar.uuid,
      periodosEQuantidadeAlunos
    );
    arrayVinculos.push({
      ativo: false,
      periodo_escolar: vinculo.periodo_escolar,
      horarios_alimentacao: montaArrayHorarios(
        vinculo,
        horarioDosAlimentos,
        uuidEscola,
        vinculo.periodo_escolar.uuid
      ),
      quantidade_alunos: info_alunos,
    });
  });
  return arrayVinculos;
};

export const montaVinculosDeHorariosInicial = (
  vinculosPeriodoEscolarUnidadeEscolar,
  horarioDosAlimentos,
  uuidEscola,
  periodosEQuantidadeAlunos
) => {
  let vinculosDeHorarios = null;
  temHorariosDeAlimentacaoCadastrado(horarioDosAlimentos)
    ? (vinculosDeHorarios = montaVinculosDeHorariosExistentes(
        vinculosPeriodoEscolarUnidadeEscolar,
        horarioDosAlimentos,
        uuidEscola,
        periodosEQuantidadeAlunos
      ))
    : (vinculosDeHorarios = montaVinculosDeHorariosIniciais(
        vinculosPeriodoEscolarUnidadeEscolar,
        uuidEscola,
        periodosEQuantidadeAlunos
      ));
  return vinculosDeHorarios;
};

export const verificaSeCampoEhValido = (
  vinculosDeHorarios,
  periodoEscolar,
  comboAlimentacaoAtual
) => {
  const hora_inicial = moment(
    vinculosDeHorarios[periodoEscolar].horarios_alimentacao[
      comboAlimentacaoAtual
    ].hora_inicial,
    "HH:mm"
  );
  const hora_final = moment(
    vinculosDeHorarios[periodoEscolar].horarios_alimentacao[
      comboAlimentacaoAtual
    ].hora_final,
    "h:mm"
  );
  return hora_inicial <= hora_final;
};

export const todosOsCamposValidos = (
  vinculosDeHorarios,
  periodoEscolar,
  comboAlimentacaoAtual
) => {
  if (
    vinculosDeHorarios[periodoEscolar].horarios_alimentacao[
      comboAlimentacaoAtual
    ]
  ) {
    const hora_inicial = moment(
      vinculosDeHorarios[periodoEscolar].horarios_alimentacao[
        comboAlimentacaoAtual
      ].hora_inicial,
      "HH:mm"
    );
    const hora_final = moment(
      vinculosDeHorarios[periodoEscolar].horarios_alimentacao[
        comboAlimentacaoAtual
      ].hora_final,
      "HH:mm"
    );
    const horaZero = moment("00:00", "HH:mm");
    return (
      hora_final > horaZero &&
      hora_inicial > horaZero &&
      hora_inicial < hora_final
    );
  }
};

export const ultimoHorarioDisponivel = (
  vinculosDeHorarios,
  periodoEscolar,
  comboAlimentacaoAtual
) => {
  const quantidadeDeCombos =
    vinculosDeHorarios[periodoEscolar].horarios_alimentacao.length;
  return quantidadeDeCombos === comboAlimentacaoAtual + 1;
};

export const ultimoPeriodoDaEscola = (vinculosDeHorarios, periodoEscolar) => {
  return vinculosDeHorarios.length === periodoEscolar + 1;
};
