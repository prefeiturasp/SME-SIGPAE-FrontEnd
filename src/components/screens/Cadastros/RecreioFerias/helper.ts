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

export const isPeriodoEditavel = (
  dataInicioStr: string,
  dataFimStr: string
) => {
  const parseDate = (str: string) => {
    if (!str) return null;
    const [dia, mes, ano] = str.split("/").map(Number);
    return new Date(ano, mes - 1, dia);
  };

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const dataInicio = parseDate(dataInicioStr);
  const dataFim = parseDate(dataFimStr);

  if (!dataInicio || !dataFim) return false;

  return hoje <= dataFim;
};

export const mapParticipanteApiToForm = (p: any) => {
  const tipos = p.tipos_alimentacao || {};
  const lote = p.lote || {};
  const unidade = p.unidade_educacional || {};

  const inscritos = (tipos.inscritos || []).map((t) => t.nome);
  const infantil = (tipos.infantil || []).map((t) => t.nome);
  const colaboradores = (tipos.colaboradores || []).map((t) => t.nome);

  const inscritosUuids = (tipos.inscritos || []).map((t) => t.uuid);
  const infantilUuids = (tipos.infantil || []).map((t) => t.uuid);
  const colaboradoresUuids = (tipos.colaboradores || []).map((t) => t.uuid);

  return {
    id: p.id || p.uuid || Date.now() + Math.random(),
    uuid: p.uuid,

    loteUuid: lote.uuid,
    dreLoteNome: lote.nome_exibicao || lote.nome || "",

    unidadeEducacionalUuid: unidade.uuid,
    unidadeEducacional: unidade.nome || "",
    unidadeEducacionalCodigoEol: unidade.codigo_eol || "",

    num_inscritos: p.num_inscritos,
    num_colaboradores: p.num_colaboradores,
    liberarMedicao: p.liberar_medicao,
    ceiOuEmei: p.cei_ou_emei || "N/A",

    alimentacaoInscritos: inscritos,
    alimentacaoInscritosInfantil: infantil,
    alimentacaoColaboradores: colaboradores,

    tiposAlimentacaoInscritosUuids: inscritosUuids,
    tiposAlimentacaoInfantilUuids: infantilUuids,
    tiposAlimentacaoColaboradoresUuids: colaboradoresUuids,
  };
};

export const mapParticipanteFormToApi = (p: any) => {
  return {
    lote: p.loteUuid,
    unidade_educacional: p.unidadeEducacionalUuid,
    num_inscritos: p.num_inscritos,
    num_colaboradores: p.num_colaboradores,
    liberar_medicao: p.liberarMedicao,
    cei_ou_emei: p.ceiOuEmei,
    tipos_alimentacao_inscritos: p.tiposAlimentacaoInscritosUuids || [],
    tipos_alimentacao_infantil: p.tiposAlimentacaoInfantilUuids || [],
    tipos_alimentacao_colaboradores: p.tiposAlimentacaoColaboradoresUuids || [],
  };
};

export const formatarNomeUnidadeEducacional = (nome, ceiOuEmei) => {
  if (ceiOuEmei === "EMEI") {
    return `${nome} - INFANTIL`;
  }

  if (ceiOuEmei === "CEI") {
    return `${nome} - CEI`;
  }

  return nome;
};
