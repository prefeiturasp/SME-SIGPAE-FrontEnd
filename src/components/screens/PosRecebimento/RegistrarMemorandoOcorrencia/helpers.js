import {
  converterValorParaDecimal,
  trocaAcentuadasPorSemAcento,
} from "src/helpers/utilities";

export const padronizarTextoMaiusculoSemAcento = (valor) => {
  if (valor === null || valor === undefined) return valor;
  return trocaAcentuadasPorSemAcento(String(valor))
    .toUpperCase()
    .replace(/-/g, " ")
    .replace(/[^A-Z0-9 ]/g, "");
};

export const OPCOES_CATEGORIA = [
  { nome: "Selecione a Categoria", uuid: "" },
  { nome: "Não Perecíveis", uuid: "NAO_PERECIVEIS" },
  {
    nome: "Perecíveis - Resfriados e Congelados",
    uuid: "PERECIVEIS_RESFRIADOS_CONGELADOS",
  },
  { nome: "FLV", uuid: "FLV" },
  { nome: "Leve Leite", uuid: "LEVE_LEITE" },
];

export const OPCOES_TIPO_OCORRENCIA = [
  { nome: "Selecione o Tipo de Ocorrência", uuid: "" },
  { nome: "Reclamação de Qualidade", uuid: "RECLAMACAO_QUALIDADE" },
  {
    nome: "Retirada de Alimento Impróprio para o Consumo",
    uuid: "RETIRADA_ALIMENTO_IMPROPRIO",
  },
  {
    nome: "Devolução de Alimento Próprio para o Consumo",
    uuid: "DEVOLUCAO_ALIMENTO_PROPRIO",
  },
];

export const TIPO_OCORRENCIA_PADRAO = "RECLAMACAO_QUALIDADE";

export const MSG_LOTE_DUPLICADO =
  "Este lote já foi informado para o produto. Verifique os dados e tente novamente.";

export const indicesLotesDuplicados = (lotes = []) => {
  const primeirasOcorrencias = new Map();
  const duplicados = new Set();
  lotes.forEach((lote, index) => {
    const numeroLote = lote?.lote?.trim();
    const marca = lote?.marca?.trim();
    const dataFabricacao = lote?.data_fabricacao;
    const dataValidade = lote?.data_validade;
    if (!numeroLote || !marca || !dataFabricacao || !dataValidade) return;
    const chave = `${numeroLote}|${marca}|${dataFabricacao}|${dataValidade}`;
    if (primeirasOcorrencias.has(chave)) {
      duplicados.add(index);
    } else {
      primeirasOcorrencias.set(chave, index);
    }
  });
  return duplicados;
};

export const criarLote = () => ({
  lote: "",
  marca: "",
  data_fabricacao: "",
  data_validade: "",
  quantidade_problema_devolucao: "0",
});

export const loteEstaCompleto = (lote) =>
  Boolean(
    lote &&
      lote.lote?.trim() &&
      lote.marca?.trim() &&
      lote.data_fabricacao &&
      lote.data_validade &&
      lote.quantidade_problema_devolucao !== "" &&
      lote.quantidade_problema_devolucao !== null &&
      lote.quantidade_problema_devolucao !== undefined,
  );

const REGEX_QUANTIDADE = /^-?(?:\d{1,3}(?:\.\d{3})+|\d+)(?:,\d{1,2})?$/;

export const quantidadeValida = (valor) => {
  if (valor === null || valor === undefined || valor === "") {
    return "Campo obrigatório";
  }

  if (!REGEX_QUANTIDADE.test(String(valor).trim())) {
    return "Informe um número válido";
  }

  const numero = Number(converterValorParaDecimal(valor));

  if (Number.isNaN(numero)) {
    return "Informe um número válido";
  }

  if (numero < 0) {
    return "Informe um valor maior ou igual a zero";
  }

  return undefined;
};

export const montarPayload = (values) => ({
  categoria: values.categoria,
  produto: values.produto?.trim(),
  tipo_ocorrencia: TIPO_OCORRENCIA_PADRAO,
  unidade_medida: values.unidade_medida,
  lotes: (values.lotes || []).map((lote) => ({
    lote: lote.lote?.trim(),
    marca: lote.marca?.trim(),
    data_fabricacao: lote.data_fabricacao,
    data_validade: lote.data_validade,
    quantidade_problema_devolucao: converterValorParaDecimal(
      lote.quantidade_problema_devolucao,
    ),
  })),
});
