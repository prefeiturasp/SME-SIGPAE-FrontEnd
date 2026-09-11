import { ehFimDeSemanaUTC } from "src/helpers/utilities";

const TIPOS_BASE_POR_LANCAMENTO_ESPECIAL = {
  "2_refeicao_1_oferta": ["refeicao"],
  repeticao_2_refeicao: ["refeicao"],
  "2_sobremesa_1_oferta": ["sobremesa"],
  repeticao_2_sobremesa: ["sobremesa"],
  "2_lanche_5h": ["lanche"],
  lanche_extra: ["lanche"],
  "2_lanche_4h": ["lanche_4h"],
};

export const getTiposAlimentacaoDaInclusaoNoDia = (
  inclusoesAutorizadas = [],
  dia,
) => {
  const tipos = [];
  (inclusoesAutorizadas || [])
    .filter((inclusao) => Number(inclusao.dia) === Number(dia))
    .forEach((inclusao) => {
      String(inclusao.alimentacoes || "")
        .split(", ")
        .forEach((alimentacao) => {
          if (alimentacao && !tipos.includes(alimentacao)) {
            tipos.push(alimentacao);
          }
        });
    });
  return tipos;
};

export const ehDiaFimDeSemanaOuFeriado = (
  dia,
  mesAnoConsiderado,
  feriadosNoMes = [],
) => {
  if (!mesAnoConsiderado) return false;
  const dateObj = new Date(
    Date.UTC(
      mesAnoConsiderado.getFullYear(),
      mesAnoConsiderado.getMonth(),
      Number(dia),
    ),
  );
  const ehFeriadoNoDia = (feriadosNoMes || []).some(
    (feriado) => Number(feriado) === Number(dia),
  );
  return ehFimDeSemanaUTC(dateObj) || ehFeriadoNoDia;
};

export const inclusaoDeFimDeSemanaRestringeAlimentacoes = (
  dia,
  mesAnoConsiderado,
  feriadosNoMes,
  inclusoesAutorizadas = [],
) => {
  const temInclusaoNoDia = (inclusoesAutorizadas || []).some(
    (inclusao) => Number(inclusao.dia) === Number(dia),
  );
  return (
    temInclusaoNoDia &&
    ehDiaFimDeSemanaOuFeriado(dia, mesAnoConsiderado, feriadosNoMes)
  );
};

export const lancamentoEspecialCompativelComInclusao = (
  rowName,
  inclusoesAutorizadas,
  dia,
) => {
  const tiposBase = TIPOS_BASE_POR_LANCAMENTO_ESPECIAL[rowName];
  if (!tiposBase) return true;
  const tiposInclusao = getTiposAlimentacaoDaInclusaoNoDia(
    inclusoesAutorizadas,
    dia,
  );
  return tiposBase.some((tipo) => tiposInclusao.includes(tipo));
};
