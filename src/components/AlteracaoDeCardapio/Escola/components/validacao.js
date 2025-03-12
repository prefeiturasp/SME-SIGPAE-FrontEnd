import moment from "moment";

export const validateSubmit = (values) => {
  values.substituicoes = values.substituicoes.filter((sub) => sub.check);
  for (const substituicao of values.substituicoes) {
    substituicao.periodo_escolar = substituicao.uuid;
    substituicao.tipos_alimentacao_de =
      substituicao.tipos_alimentacao_de_selecionados;
    substituicao.tipos_alimentacao_para =
      substituicao.tipos_alimentacao_para_selecionados;
  }

  if (values["alterar_dia"]) {
    values["data_inicial"] = values["alterar_dia"];
    values["data_final"] = values["alterar_dia"];
  }

  if (
    !(values["alterar_dia"] || values["data_inicial"] || values["data_final"])
  )
    return "Obrigatório informar uma data ou período.";

  const dataInicial = moment(values["data_inicial"], "DD/MM/YYYY");
  const dataFinal = moment(values["data_final"], "DD/MM/YYYY");
  const diferencaDeDias = dataFinal.diff(dataInicial, "days");

  if (!values["alterar_dia"] && diferencaDeDias <= 0)
    return "Data inicial deve ser anterior à data final.";

  if (
    (values["data_inicial"] && !values["data_final"]) ||
    (values["data_final"] && !values["data_inicial"])
  )
    return "Informe um período completo.";

  if (
    values.substituicoes.some((sub) =>
      ["", null].includes(sub.tipos_alimentacao_de)
    )
  )
    return 'Preencher corretamente o campo "Alterar alimentação de"';

  if (
    values.substituicoes.some((sub) =>
      ["", null].includes(sub.tipos_alimentacao_para)
    )
  )
    return 'Preencher corretamente o campo "Para alimentação"';

  if (
    values.substituicoes.some((sub) => [0, "", null].includes(sub.qtd_alunos))
  )
    return 'Preencher corretamente o campo "Nº de Alunos"';

  return false;
};
