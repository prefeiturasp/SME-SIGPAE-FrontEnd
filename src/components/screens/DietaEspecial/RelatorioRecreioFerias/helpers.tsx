import { deepCopy } from "src/helpers/utilities";

interface ICampo {
  campo: string;
  total: string;
}

const PAGE_SIZE: number = 10;

const CAMPOS_MULTSELECT_PADRAO: ICampo[] = [
  { campo: "unidades_educacionais_selecionadas", total: "unidades_length" },
  {
    campo: "classificacoes_selecionadas",
    total: "classificacoes_length",
  },
  {
    campo: "alergias_intolerancias_selecionadas",
    total: "alergias_intolerancias_length",
  },
];

export const normalizarValores = (values: object = {}, page: number = 1) => {
  const valuesCopy = deepCopy(values);
  CAMPOS_MULTSELECT_PADRAO.forEach(({ campo, total }) => {
    const arr = valuesCopy[campo];
    if (arr?.length === valuesCopy[total]) {
      delete valuesCopy[campo];
    }
    delete valuesCopy[total];
  });

  return {
    page_size: PAGE_SIZE,
    page,
    ...valuesCopy,
  };
};
