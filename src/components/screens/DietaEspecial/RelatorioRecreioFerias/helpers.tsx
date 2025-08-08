import { deepCopy } from "src/helpers/utilities";

const PAGE_SIZE: number = 10;

const CAMPOS_MULTSELECT_PADRAO: string[] = [
  "unidades_educacionais_selecionadas",
  "alergias_intolerancias_selecionadas",
  "classificacoes_selecionadas",
];

export const normalizarValores = (
  values: object = {},
  page: number = 1,
  camposExtras: string[] = []
) => {
  const valuesCopy = deepCopy(values);

  const camposMultiselect = [...CAMPOS_MULTSELECT_PADRAO, ...camposExtras];

  camposMultiselect.forEach((campo) => {
    const arr = valuesCopy[campo];
    if (Array.isArray(arr) && arr.some((v) => ["todas", "todos"].includes(v))) {
      delete valuesCopy[campo];
    }
  });

  return {
    page_size: PAGE_SIZE,
    page,
    ...valuesCopy,
  };
};
