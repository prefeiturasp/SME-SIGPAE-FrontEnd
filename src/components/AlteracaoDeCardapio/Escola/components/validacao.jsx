import moment from "moment";

export const validateSubmit = (values) => {
  if (!values.substituicoes.some((subs) => subs.check)) {
    return "Obrigatório selecionar ao menos um período.";
  }

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
    return "Obrigatório preencher Alterar dia ou De e Até";

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

  return false;
};
