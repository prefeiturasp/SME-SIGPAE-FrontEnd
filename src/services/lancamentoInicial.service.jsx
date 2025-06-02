import axios from "./_base";

export const registraLancamentoDiario = async (payload) =>
  await axios.post("/lancamento-diario/", payload);

export const getLancamentosPorMes = async (payload) =>
  await axios.get("/lancamento-diario/por-mes/", { params: payload });

export const getLancamentosDeUmDia = async (data, escolaPeriodoEscolarUUID) =>
  await axios.get("/lancamento-diario/", {
    params: {
      data,
      escola_periodo_escolar: escolaPeriodoEscolarUUID,
    },
  });

export const getDadosDeUmDia = async (data, escolaPeriodoEscolarUUID) =>
  await axios.get("/lancamento-diario/dados-dia-periodo/", {
    params: {
      data,
      escola_periodo_escolar: escolaPeriodoEscolarUUID,
    },
  });
