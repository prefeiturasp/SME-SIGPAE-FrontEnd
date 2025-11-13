import moment from "moment";

export const mapUnidade = (u: any) => {
  return {
    lote: u.loteUuid,
    unidade_educacional: u.unidadeEducacionalUuid,
    num_inscritos: parseInt(u.num_inscritos ?? "0", 10) || 0,
    num_colaboradores: parseInt(u.num_colaboradores ?? "0", 10) || 0,
    liberar_medicao: !!u.liberarMedicao,
    tipos_alimentacao_inscritos: u.tiposAlimentacaoInscritosUuids ?? [],
    tipos_alimentacao_infantil: u.tiposAlimentacaoInfantilUuids ?? [],
    tipos_alimentacao_colaboradores: u.tiposAlimentacaoColaboradoresUuids ?? [],
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

export const resetFormState = (form, setExpandidos) => {
  form.setConfig("keepDirtyOnReinitialize", false);

  form.restart({
    titulo_cadastro: undefined,
    periodo_realizacao_de: undefined,
    periodo_realizacao_ate: undefined,
    unidades_participantes: [],
  });

  form.setConfig("keepDirtyOnReinitialize", true);

  setExpandidos({});
};

export const validateForm = (values: any) => {
  const unidades = values?.unidades_participantes || [];
  if (unidades.length === 0) return {};

  const unidadesErrors = unidades.map((u: any) => {
    const errors: any = {};

    if (!u?.num_inscritos || Number(u.num_inscritos) <= 0) {
      errors.num_inscritos = "Informe o nº de inscritos (maior que 0)";
    }

    if (!u?.num_colaboradores || Number(u.num_colaboradores) <= 0) {
      errors.num_colaboradores = "Informe o nº de colaboradores (maior que 0)";
    }

    return Object.keys(errors).length ? errors : undefined;
  });

  return unidadesErrors.some(Boolean)
    ? { unidades_participantes: unidadesErrors }
    : {};
};
