import { deepCopy } from "src/helpers/utilities";

export const totalAlunosPorPeriodo = (values, index) => {
  let totalAlunos = 0;
  return (
    values.substituicoes[index].faixas_etarias &&
    values.substituicoes[index].faixas_etarias.reduce(function (total, faixa) {
      return total + faixa.count;
    }, totalAlunos)
  );
};

export const totalAlunosInputPorPeriodo = (values, index) => {
  const faixas = values.substituicoes[index].faixas;
  if (!faixas) return 0;
  return Object.values(faixas).reduce(function (total, faixa) {
    return total + parseInt(faixa);
  }, 0);
};

export const formataPayload = (values) => {
  const values_ = deepCopy(values);
  let filteredSubstituicoes = values_.substituicoes.filter((obj) =>
    Object.prototype.hasOwnProperty.call(obj, "faixas")
  );
  values_.substituicoes = filteredSubstituicoes;
  values_.data = values_.data.split("/").reverse().join("-");
  values_.substituicoes.forEach((substituicao) => {
    const faixas_etarias = [];
    substituicao.periodo_escolar = substituicao.uuid;
    substituicao.faixas_etarias.forEach((faixa) => {
      if (substituicao.faixas[faixa.faixa_etaria.uuid]) {
        faixas_etarias.push({
          faixa_etaria: faixa.faixa_etaria.uuid,
          quantidade: substituicao.faixas[faixa.faixa_etaria.uuid],
          matriculados_quando_criado: faixa.count,
        });
      }
    });
    substituicao.faixas_etarias = faixas_etarias;
    if (typeof substituicao.tipos_alimentacao_de === "string") {
      substituicao.tipos_alimentacao_de = [substituicao.tipos_alimentacao_de];
    }
    if (substituicao.tipos_alimentacao_de_selecionados) {
      substituicao.tipos_alimentacao_de =
        substituicao.tipos_alimentacao_de_selecionados;
    }
  });
  return values_;
};

export const validaForm = (values) => {
  let erro = "";
  if (!values.substituicoes.find((subs) => subs.checked)) {
    erro = "É necessário selecionar pelo menos um período";
    return erro;
  }
  if (
    !values.substituicoes
      .filter((subs) => subs.checked)
      .find((subs) => subs.faixas)
  ) {
    erro =
      "Ao selecionar um período, é necessário preencher ao menos uma faixa etária";
  }
  return erro;
};
