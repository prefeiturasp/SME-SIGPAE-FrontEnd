const CAMPOS_A_PREENCHER = ["alimento", "tipo", "substitutos"];

export const validateSubstituicao = (substituicao) => {
  const camposNaoPreenchidos = CAMPOS_A_PREENCHER.filter(
    (campo) =>
      !Object.keys(substituicao).includes(campo) ||
      (campo === "substitutos" &&
        substituicao.substitutos &&
        substituicao.substitutos.length === 0)
  );
  return camposNaoPreenchidos.length === 0
    ? undefined
    : `Falta preencher ${camposNaoPreenchidos.join(", ")}`;
};

export const formataOpcoesClassificacaoDieta = (classificacoesDieta) => {
  const opcoes = classificacoesDieta.map((classificacao) => {
    return { nome: classificacao.nome, uuid: classificacao.id.toString() };
  });
  return opcoes;
};

export const formataSubstituicoes = (dietaEspecial) => {
  if (dietaEspecial?.substituicoes.length) {
    const substituicoes = dietaEspecial.substituicoes.map((substituicao) => {
      const alimentos_substitutos = substituicao.alimentos_substitutos.map(
        (alimento) => alimento.uuid
      );
      const substitutos = substituicao.substitutos.map(
        (alimento) => alimento.uuid
      );
      return {
        alimento: String(substituicao.alimento.id),
        tipo: ["Substituir", "S"].includes(substituicao.tipo) ? "S" : "I",
        substitutos: substitutos.concat(alimentos_substitutos),
      };
    });
    return substituicoes;
  }
  return [{}];
};

export const formataAlergias = (dietaEspecial) => {
  const alergias = dietaEspecial.alergias_intolerancias.map((alergia) => {
    const id = alergia.id.toString();
    return {
      uuid: id,
      nome: alergia.descricao,
    };
  });

  return alergias;
};
