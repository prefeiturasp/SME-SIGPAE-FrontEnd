export const REFEICAO_E_SOBREMESA = "refeicao_e_sobremesa";

const TIPOS_REFEICAO_E_SOBREMESA = ["Refeição", "Sobremesa"];

export const agruparRefeicaoESobremesa = (tiposAlimentacao) => {
  const nomes = tiposAlimentacao.map((tipo) => tipo.nome);
  const possuiRefeicaoESobremesa = TIPOS_REFEICAO_E_SOBREMESA.every((nome) =>
    nomes.includes(nome),
  );
  if (!possuiRefeicaoESobremesa) return tiposAlimentacao;
  return [
    ...tiposAlimentacao.filter((tipo) => tipo.nome !== "Sobremesa"),
    { nome: "Refeição e Sobremesa", uuid: REFEICAO_E_SOBREMESA },
  ];
};

export const expandirTiposAlimentacao = (
  selecionado,
  tiposAlimentacao = [],
) => {
  if (!selecionado) return [];
  if (selecionado === REFEICAO_E_SOBREMESA) {
    return tiposAlimentacao
      .filter((tipo) => TIPOS_REFEICAO_E_SOBREMESA.includes(tipo.nome))
      .map((tipo) => tipo.uuid);
  }
  return [selecionado];
};

export const obterTipoAlimentacaoSelecionado = (
  tiposSelecionados = [],
  tiposAlimentacao = [],
) => {
  const uuids = tiposSelecionados.map((tipo) => tipo.uuid);
  const refeicao = tiposAlimentacao.find(
    (tipo) => tipo.nome === "Refeição",
  )?.uuid;
  const sobremesa = tiposAlimentacao.find(
    (tipo) => tipo.nome === "Sobremesa",
  )?.uuid;
  if (
    refeicao &&
    sobremesa &&
    uuids.length === 2 &&
    uuids.includes(refeicao) &&
    uuids.includes(sobremesa)
  ) {
    return REFEICAO_E_SOBREMESA;
  }
  return uuids[0];
};

const getDaysArray = (start, end) => {
  let arr = [];
  for (
    let dt = new Date(start);
    dt <= new Date(end);
    dt.setDate(dt.getDate() + 1)
  ) {
    arr.push(new Date(dt).toISOString().split("T")[0]);
  }
  return arr;
};

export const formataValues = (values) => {
  if (values.data_inicial && values.data_final) {
    values.datas_intervalo = getDaysArray(
      values.data_inicial.split("/").reverse().join("-"),
      values.data_final.split("/").reverse().join("-"),
    ).map((data) => ({ data: data }));
  } else if (values.alterar_dia) {
    values.datas_intervalo = getDaysArray(
      values.alterar_dia.split("/").reverse().join("-"),
      values.alterar_dia.split("/").reverse().join("-"),
    ).map((data) => ({ data: data }));
  }

  values.substituicoes?.forEach((substituicao) => {
    if (substituicao.tipos_alimentacao_de !== undefined) {
      substituicao.tipos_alimentacao_de = expandirTiposAlimentacao(
        substituicao.tipos_alimentacao_de,
        substituicao.tipos_alimentacao,
      );
    }
    if (substituicao.tipos_alimentacao_para !== undefined) {
      substituicao.tipos_alimentacao_para = expandirTiposAlimentacao(
        substituicao.tipos_alimentacao_para,
        substituicao.tipos_alimentacao,
      );
    }
  });
  return values;
};
