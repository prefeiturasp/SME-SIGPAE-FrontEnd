import moment from "moment";

import { getMesAno } from "src/components/screens/LancamentoInicial/Relatorios/RelatorioAdesao/components/FormFiltro/helpers";

import { IFiltros } from "../../types";
import { GrupoUnidadeEscolar } from "./types";

export const GRUPO_TIPO_ALIMENTACAO_BLOQUEADO = "Grupo 1";
export const GRUPOS_COM_FAIXA_ETARIA = ["Grupo 1", "Grupo 2"];

export const PREFIXO_GRUPO_TREE = "grupo_";

const FORMATO_DATA = "DD/MM/YYYY";

export const dataDentroDoMes = (data: string, mes: string): boolean => {
  const dataMoment = moment(data, FORMATO_DATA, true);
  if (!dataMoment.isValid()) return false;
  const { mes: mesSelecionado, ano } = getMesAno(mes);
  return dataMoment.month() + 1 === mesSelecionado && dataMoment.year() === ano;
};

export const validaPeriodoDe = (value: string, values: IFiltros) => {
  if (!value || !values.mes) return undefined;
  if (!dataDentroDoMes(value, values.mes)) {
    return "A data deve estar dentro do mês de referência";
  }
  if (
    values.periodo_lancamento_ate &&
    moment(value, FORMATO_DATA).isAfter(
      moment(values.periodo_lancamento_ate, FORMATO_DATA),
    )
  ) {
    return "A data inicial não pode ser posterior à data final";
  }
  return undefined;
};

export const validaPeriodoAte = (value: string, values: IFiltros) => {
  if (!value || !values.mes) return undefined;
  if (!dataDentroDoMes(value, values.mes)) {
    return "A data deve estar dentro do mês de referência";
  }
  if (
    values.periodo_lancamento_de &&
    moment(value, FORMATO_DATA).isBefore(
      moment(values.periodo_lancamento_de, FORMATO_DATA),
    )
  ) {
    return "A data final não pode ser anterior à data inicial";
  }
  return undefined;
};

export const getGrupoSelecionado = (
  grupos: Array<GrupoUnidadeEscolar>,
  tiposUnidadesSelecionados: Array<string>,
): GrupoUnidadeEscolar | undefined =>
  grupos.find((grupo) =>
    grupo.tipos_unidades.some((tipo) =>
      tiposUnidadesSelecionados.includes(tipo.uuid),
    ),
  );

export const filtraSelecionadosDisponiveis = (
  selecionados: Array<string> | undefined,
  disponiveis: Array<string>,
): Array<string> =>
  (selecionados || []).filter((uuid) => disponiveis.includes(uuid));
