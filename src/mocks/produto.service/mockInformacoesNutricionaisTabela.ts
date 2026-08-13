import { InformacaoNutricional } from "src/interfaces/produto.interface";

export const infoEnergetico: InformacaoNutricional = {
  uuid: "u-energetico",
  nome: "VALOR ENERGÉTICO",
  medida: "KCAL",
  eh_fixo: true,
  eh_dependente: false,
  tipo_nutricional: { uuid: "t1", nome: "CALORIA" },
};

export const infoCarboidratos: InformacaoNutricional = {
  uuid: "u-carb",
  nome: "CARBOIDRATOS TOTAIS",
  medida: "G",
  eh_fixo: true,
  eh_dependente: false,
  tipo_nutricional: { uuid: "t2", nome: "CARBOIDRATOS" },
};

export const infoSodio: InformacaoNutricional = {
  uuid: "u-sodio",
  nome: "SÓDIO",
  medida: "MG",
  eh_fixo: false,
  eh_dependente: false,
  tipo_nutricional: { uuid: "t3", nome: "SÓDIO" },
};

export const infoFibra: InformacaoNutricional = {
  uuid: "u-fibra",
  nome: "FIBRA ALIMENTAR",
  medida: "G",
  eh_fixo: false,
  eh_dependente: false,
  tipo_nutricional: { uuid: "t4", nome: "FIBRA" },
};

export const mockInformacoesNutricionaisTabela: InformacaoNutricional[] = [
  infoEnergetico,
  infoCarboidratos,
  infoSodio,
  infoFibra,
];
