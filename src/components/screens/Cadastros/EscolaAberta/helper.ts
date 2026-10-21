import moment from "moment";

const formatarData = (data: any) =>
  data ? moment(data, "DD/MM/YYYY").format("DD/MM/YYYY") : null;

export const buildPayload = (values: any) => {
  const unidades = values.unidades_participantes || [];

  return {
    recorrencias: {
      data_inicial: formatarData(values.periodo_realizacao_de),
      data_final: formatarData(values.periodo_realizacao_ate),
      dias_semana: values.recorrencias?.dias_semana || [],
    },
    unidades_participantes: unidades.map((u: any) => ({
      lote: u.loteUuid,
      unidade_educacional: u.unidadeEducacionalUuid,
      tipos_alimentacao: u.tiposAlimentacaoParticipantesUuids || [],
      num_participantes: Number(u.num_participantes),
    })),
  };
};

export const mapApiToForm = (data: any) => ({
  periodo_realizacao_de: formatarData(data?.data_inicial),
  periodo_realizacao_ate: formatarData(data?.data_final),
  recorrencias: {
    dias_semana: data?.dias_semana || [],
  },
  unidades_participantes: (data?.unidades_participantes || []).map(
    (u: any) => ({
      id: u.uuid,
      loteUuid: u.lote,
      unidadeEducacionalUuid: u.unidade_educacional,
      tiposAlimentacaoParticipantesUuids: (u.tipos_alimentacao || []).map(
        (t: any) => t.uuid,
      ),
      dreLoteNome: u.lote_nome,
      unidadeEducacional: u.unidade_educacional_nome,
      alimentacaoParticipantes: (u.tipos_alimentacao || [])
        .map((t: any) => t.nome)
        .join(", "),
      num_participantes: u.num_participantes ?? undefined,
    }),
  ),
});

export const resetFormState = (form) => {
  form.setConfig("keepDirtyOnReinitialize", false);

  form.restart({
    periodo_realizacao_de: undefined,
    periodo_realizacao_ate: undefined,
    recorrencias: { dias_semana: [] },
    unidades_participantes: [],
  });

  form.setConfig("keepDirtyOnReinitialize", true);
};

export const validateForm = (values: any) => {
  const unidades = values?.unidades_participantes || [];
  if (unidades.length === 0) return {};

  const unidadesErrors = unidades.map((u: any) => {
    const errors: any = {};

    if (!u?.num_participantes || Number(u.num_participantes) <= 0) {
      errors.num_participantes = "Informe o nº de participantes (maior que 0)";
    }

    return Object.keys(errors).length ? errors : undefined;
  });

  return unidadesErrors.some(Boolean)
    ? { unidades_participantes: unidadesErrors }
    : {};
};
