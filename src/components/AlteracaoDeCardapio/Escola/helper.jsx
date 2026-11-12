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
  if (Array.isArray(selecionado)) {
    return selecionado.flatMap((item) =>
      expandirTiposAlimentacao(item, tiposAlimentacao),
    );
  }
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

const parseDataIsoLocal = (iso) => {
  const [ano, mes, dia] = iso.split("-").map(Number);
  return new Date(ano, mes - 1, dia);
};

const formatarDataIsoLocal = (data) => {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
};

const getDaysArray = (start, end) => {
  const datas = [];
  const cursor = parseDataIsoLocal(start);
  const limite = parseDataIsoLocal(end);

  while (cursor <= limite) {
    datas.push(formatarDataIsoLocal(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return datas;
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
