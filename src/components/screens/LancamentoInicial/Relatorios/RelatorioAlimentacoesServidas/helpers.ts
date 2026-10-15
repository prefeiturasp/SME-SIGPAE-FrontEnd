import { RelatorioAlimentacoesServidasParams } from "src/services/medicaoInicial/relatorio.interface";

import { separaMesesERecreios } from "./components/FormFiltro/helpers";
import { IFiltros } from "./types";

type CampoLista =
  | "lotes"
  | "subprefeituras"
  | "tipos_unidades"
  | "unidades_educacionais"
  | "tipos_alimentacao"
  | "faixas_etarias";

type CampoPeriodo = "periodo_lancamento_de" | "periodo_lancamento_ate";

const CAMPOS_LISTA: Array<CampoLista> = [
  "lotes",
  "subprefeituras",
  "tipos_unidades",
  "unidades_educacionais",
  "tipos_alimentacao",
  "faixas_etarias",
];

const CAMPOS_PERIODO: Array<CampoPeriodo> = [
  "periodo_lancamento_de",
  "periodo_lancamento_ate",
];

export const montaParamsExportacao = (
  values: IFiltros,
): RelatorioAlimentacoesServidasParams => {
  const { meses, recreios_nas_ferias } = separaMesesERecreios(values.meses);
  const params: RelatorioAlimentacoesServidasParams = { dres: values.dres };
  if (meses.length) {
    params.meses = meses;
  }
  if (recreios_nas_ferias.length) {
    params.recreios_nas_ferias = recreios_nas_ferias;
  }

  CAMPOS_LISTA.forEach((campo) => {
    const selecionados = values[campo];
    if (selecionados?.length) {
      params[campo] = selecionados;
    }
  });

  CAMPOS_PERIODO.forEach((campo) => {
    const data = values[campo];
    if (data) {
      params[campo] = data;
    }
  });

  return params;
};
