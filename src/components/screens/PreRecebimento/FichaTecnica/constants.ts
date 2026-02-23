import {
  OptionsCategoria,
  OptionsEntrega,
  OptionsPrograma,
} from "./interfaces";

export const CATEGORIA_OPTIONS: OptionsCategoria[] = [
  {
    uuid: "FLV",
    nome: "FLV (Frutas, Legumes e Verduras)",
  },
  {
    uuid: "PERECIVEIS",
    nome: "Perecíveis",
  },
  {
    uuid: "NAO_PERECIVEIS",
    nome: "Não Perecíveis",
  },
];

export const TIPO_ENTREGA_OPTIONS: OptionsEntrega[] = [
  {
    uuid: "ARMAZEM",
    nome: "Armazém",
  },
  {
    uuid: "PONTO_A_PONTO",
    nome: "Ponto a Ponto",
  },
];

export const PROGRAMA_OPTIONS: OptionsPrograma[] = [
  {
    uuid: "ALIMENTACAO_ESCOLAR",
    nome: "Alimentação Escolar",
  },
  {
    uuid: "LEVE_LEITE",
    nome: "Leve Leite",
  },
];
