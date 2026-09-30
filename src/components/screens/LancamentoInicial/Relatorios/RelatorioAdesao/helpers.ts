import {
  RelatorioAdesaoParams,
  RelatorioAdesaoResultadoIndividual,
} from "src/services/medicaoInicial/relatorio.interface";

import { IFiltros, IResultadoIndividual } from "./types";

const formataTiposUnidade = (
  tipos?: RelatorioAdesaoResultadoIndividual["tipos_unidades"],
): string => {
  if (!tipos) return "";
  if (typeof tipos === "string") return tipos;
  return tipos
    .map((tipo) =>
      typeof tipo === "string" ? tipo : tipo.iniciais || tipo.nome || "",
    )
    .filter(Boolean)
    .join(", ");
};

export const montaParamsRelatorioAdesao = (
  values: IFiltros,
  page?: number,
): RelatorioAdesaoParams => ({
  mes_ano: values.mes,
  lotes: values.lotes,
  tipos_unidades: values.tipos_unidades,
  escola__uuid: values.unidade_educacional,
  periodos_escolares: values.periodos,
  tipos_alimentacao: values.tipos_alimentacao,
  periodo_lancamento_de: values.periodo_lancamento_de,
  periodo_lancamento_ate: values.periodo_lancamento_ate,
  ...(values.resultado_individual_por_data
    ? { resultado_individual_por_data: true }
    : {}),
  ...(page ? { page } : {}),
});

export const devePaginarRelatorioAdesao = (values: IFiltros): boolean =>
  Boolean(values.resultado_individual_por_data) ||
  (values.unidade_educacional?.length ?? 0) > 0;

export const montaIdentificacaoResultadoIndividual = (
  item: RelatorioAdesaoResultadoIndividual | undefined,
  fallbackTiposUnidade?: Array<string>,
): IResultadoIndividual => {
  const tipos = formataTiposUnidade(item?.tipos_unidades);
  const tipoUnidade =
    item?.tipo_unidade ||
    [item?.grupo_unidade, tipos].filter(Boolean).join(" - ") ||
    fallbackTiposUnidade?.join(", ") ||
    "";

  return {
    data: item?.data || "",
    tipo_unidade: tipoUnidade,
  };
};
