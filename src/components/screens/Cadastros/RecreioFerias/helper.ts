import moment from "moment";

export const mapUnidade = (u: any) => {
  return {
    lote: u.loteUuid,
    unidade_educacional: u.unidadeEducacionalUuid,
    num_inscritos: parseInt(u.num_inscritos ?? "0", 10) || 0,
    num_colaboradores: parseInt(u.num_colaboradores ?? "0", 10) || 0,
    liberar_medicao: !!u.liberarMedicao,
    tipos_alimentacao_inscritos: u.tiposAlimentacaoInscritosUuids ?? [],
    tipos_alimentacao_colaboradores: u.tiposAlimentacaoColaboradoresUuids ?? [],
    tipos_alimentacao_infantil: u.tiposAlimentacaoInfantilUuids ?? [],
    cei_ou_emei: u?.ceiOuEmei,
  };
};

export const buildPayload = (values: any) => {
  const {
    titulo_cadastro: titulo,
    periodo_realizacao_de: periodoDe,
    periodo_realizacao_ate: periodoAte,
    unidades_participantes: unidades = [],
  } = values || {};

  return {
    titulo,
    data_inicio: moment(periodoDe, "DD/MM/YYYY").format("YYYY-MM-DD"),
    data_fim: moment(periodoAte, "DD/MM/YYYY").format("YYYY-MM-DD"),
    unidades_participantes: unidades.map(mapUnidade),
  };
};

export const resetFormState = (
  form,
  setUnidadesParticipantes,
  setExpandidos
) => {
  form.setConfig("keepDirtyOnReinitialize", false);

  form.restart({
    titulo_cadastro: undefined,
    periodo_realizacao_de: undefined,
    periodo_realizacao_ate: undefined,
    unidades_participantes: [],
  });

  form.setConfig("keepDirtyOnReinitialize", true);

  setUnidadesParticipantes([]);
  setExpandidos({});
};
