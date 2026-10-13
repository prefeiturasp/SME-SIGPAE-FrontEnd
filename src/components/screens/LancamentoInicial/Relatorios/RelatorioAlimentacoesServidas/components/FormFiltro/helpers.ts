import moment from "moment";

import { getMesAno } from "src/components/screens/LancamentoInicial/Relatorios/RelatorioAdesao/components/FormFiltro/helpers";

import { IFiltros } from "../../types";
import { GrupoUnidadeEscolar } from "./types";

export const GRUPO_TIPO_ALIMENTACAO_BLOQUEADO = "Grupo 1";
export const GRUPOS_COM_FAIXA_ETARIA = ["Grupo 1", "Grupo 2"];

export const PREFIXO_GRUPO_TREE = "grupo_";

export const SEPARADOR_RECREIO = "|";

const FORMATO_DATA = "DD/MM/YYYY";

const MENSAGEM_DATA_FORA_DOS_MESES =
  "A data deve estar dentro de um mês de referência selecionado";

export const formataValorMesReferencia = (
  mesAno: string,
  recreioNasFeriasUuid?: string,
): string =>
  recreioNasFeriasUuid
    ? `${mesAno}${SEPARADOR_RECREIO}${recreioNasFeriasUuid}`
    : mesAno;

export const getMesAnoDoValor = (valor: string): string =>
  valor.split(SEPARADOR_RECREIO)[0];

export const separaMesesERecreios = (
  valores: Array<string> = [],
): { meses: Array<string>; recreios_nas_ferias: Array<string> } => {
  const meses: Array<string> = [];
  const recreios_nas_ferias: Array<string> = [];
  valores.forEach((valor) => {
    const [mesAno, recreioNasFeriasUuid] = valor.split(SEPARADOR_RECREIO);
    if (recreioNasFeriasUuid) {
      if (!recreios_nas_ferias.includes(recreioNasFeriasUuid)) {
        recreios_nas_ferias.push(recreioNasFeriasUuid);
      }
    } else if (!meses.includes(mesAno)) {
      meses.push(mesAno);
    }
  });
  return { meses, recreios_nas_ferias };
};

const mesmoMesAno = (data: moment.Moment, valor: string): boolean => {
  const { mes, ano } = getMesAno(getMesAnoDoValor(valor));
  return data.month() + 1 === mes && data.year() === ano;
};

export const dataDentroDosMeses = (
  data: string,
  meses: Array<string> = [],
): boolean => {
  const dataMoment = moment(data, FORMATO_DATA, true);
  if (!dataMoment.isValid()) return false;
  return meses.some((mesAno) => mesmoMesAno(dataMoment, mesAno));
};

export const diaPertenceAosMeses = (
  data: Date,
  meses: Array<string> = [],
): boolean => meses.some((mesAno) => mesmoMesAno(moment(data), mesAno));

export const getIntervaloMeses = (
  meses: Array<string> = [],
): { primeiroDia: Date; ultimoDia: Date } | null => {
  if (!meses.length) return null;
  const datas = meses.map((valor) => {
    const { mes, ano } = getMesAno(getMesAnoDoValor(valor));
    return {
      primeiroDia: new Date(ano, mes - 1, 1),
      ultimoDia: new Date(ano, mes, 0),
    };
  });
  return {
    primeiroDia: new Date(
      Math.min(...datas.map(({ primeiroDia }) => primeiroDia.getTime())),
    ),
    ultimoDia: new Date(
      Math.max(...datas.map(({ ultimoDia }) => ultimoDia.getTime())),
    ),
  };
};

const paraData = (data?: string): Date | null =>
  data ? moment(data, FORMATO_DATA).toDate() : null;

export const getLimitesPeriodoDe = (values: IFiltros) => {
  const intervalo = getIntervaloMeses(values.meses);
  return {
    minDate: intervalo?.primeiroDia ?? null,
    maxDate:
      paraData(values.periodo_lancamento_ate) ?? intervalo?.ultimoDia ?? null,
  };
};

export const getLimitesPeriodoAte = (values: IFiltros) => {
  const intervalo = getIntervaloMeses(values.meses);
  return {
    minDate:
      paraData(values.periodo_lancamento_de) ?? intervalo?.primeiroDia ?? null,
    maxDate: intervalo?.ultimoDia ?? null,
  };
};

export const validaPeriodoDe = (value: string, values: IFiltros) => {
  if (!value || !values.meses?.length) return undefined;
  if (!dataDentroDosMeses(value, values.meses)) {
    return MENSAGEM_DATA_FORA_DOS_MESES;
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
  if (!value || !values.meses?.length) return undefined;
  if (!dataDentroDosMeses(value, values.meses)) {
    return MENSAGEM_DATA_FORA_DOS_MESES;
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

export const getGruposSelecionados = (
  grupos: Array<GrupoUnidadeEscolar>,
  tiposUnidadesSelecionados: Array<string>,
): Array<GrupoUnidadeEscolar> =>
  grupos.filter((grupo) =>
    grupo.tipos_unidades.some((tipo) =>
      tiposUnidadesSelecionados.includes(tipo.uuid),
    ),
  );

export const ehTipoAlimentacaoBloqueado = (
  gruposSelecionados: Array<GrupoUnidadeEscolar>,
): boolean =>
  gruposSelecionados.length > 0 &&
  gruposSelecionados.every(
    (grupo) => grupo.nome === GRUPO_TIPO_ALIMENTACAO_BLOQUEADO,
  );

export const ehFaixaEtariaHabilitada = (
  gruposSelecionados: Array<GrupoUnidadeEscolar>,
): boolean =>
  gruposSelecionados.some((grupo) =>
    GRUPOS_COM_FAIXA_ETARIA.includes(grupo.nome),
  );

export const filtraSelecionadosDisponiveis = (
  selecionados: Array<string> | undefined,
  disponiveis: Array<string>,
): Array<string> =>
  (selecionados || []).filter((uuid) => disponiveis.includes(uuid));
