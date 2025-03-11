import moment from "moment";

export const validateSubmit = (values, meusDados) => {
  values["substituicoes"] = [];
  let totalAlunos = 0;

  if (values.substituicoes_MANHA && values.substituicoes_MANHA.check) {
    totalAlunos += parseInt(values.substituicoes_MANHA.numero_de_alunos);
    values["substituicoes"].push({
      periodo_escolar: values.substituicoes_MANHA.periodo,
      tipos_alimentacao_de: values.substituicoes_MANHA.tipos_alimentacao_de,
      tipos_alimentacao_para: values.substituicoes_MANHA.tipos_alimentacao_para,
      qtd_alunos: values.substituicoes_MANHA.numero_de_alunos,
    });
  }

  if (values.substituicoes_TARDE && values.substituicoes_TARDE.check) {
    totalAlunos += parseInt(values.substituicoes_TARDE.numero_de_alunos);
    values["substituicoes"].push({
      periodo_escolar: values.substituicoes_TARDE.periodo,
      tipos_alimentacao_de: values.substituicoes_TARDE.tipos_alimentacao_de,
      tipos_alimentacao_para: values.substituicoes_TARDE.tipos_alimentacao_para,
      qtd_alunos: values.substituicoes_TARDE.numero_de_alunos,
    });
  }

  if (values.substituicoes_NOITE && values.substituicoes_NOITE.check) {
    totalAlunos += parseInt(values.substituicoes_NOITE.numero_de_alunos);
    values["substituicoes"].push({
      periodo_escolar: values.substituicoes_NOITE.periodo,
      tipos_alimentacao_de: values.substituicoes_NOITE.tipos_alimentacao_de,
      tipos_alimentacao_para: values.substituicoes_NOITE.tipos_alimentacao_para,
      qtd_alunos: values.substituicoes_NOITE.numero_de_alunos,
    });
  }

  if (values.substituicoes_INTEGRAL && values.substituicoes_INTEGRAL.check) {
    totalAlunos += parseInt(values.substituicoes_INTEGRAL.numero_de_alunos);
    values["substituicoes"].push({
      periodo_escolar: values.substituicoes_INTEGRAL.periodo,
      tipos_alimentacao_de: values.substituicoes_INTEGRAL.tipos_alimentacao_de,
      tipos_alimentacao_para:
        values.substituicoes_INTEGRAL.tipos_alimentacao_para,
      qtd_alunos: values.substituicoes_INTEGRAL.numero_de_alunos,
    });
  }

  if (
    values.substituicoes_VESPERTINO &&
    values.substituicoes_VESPERTINO.check
  ) {
    totalAlunos += parseInt(values.substituicoes_VESPERTINO.numero_de_alunos);
    values["substituicoes"].push({
      periodo_escolar: values.substituicoes_VESPERTINO.periodo,
      tipos_alimentacao_de:
        values.substituicoes_VESPERTINO.tipos_alimentacao_de,
      tipos_alimentacao_para:
        values.substituicoes_VESPERTINO.tipos_alimentacao_para,
      qtd_alunos: values.substituicoes_VESPERTINO.numero_de_alunos,
    });
  }

  if (
    values.substituicoes_INTERMEDIARIO &&
    values.substituicoes_INTERMEDIARIO.check
  ) {
    totalAlunos += parseInt(
      values.substituicoes_INTERMEDIARIO.numero_de_alunos
    );
    values["substituicoes"].push({
      periodo_escolar: values.substituicoes_INTERMEDIARIO.periodo,
      tipos_alimentacao_de:
        values.substituicoes_INTERMEDIARIO.tipos_alimentacao_de,
      tipos_alimentacao_para:
        values.substituicoes_INTERMEDIARIO.tipos_alimentacao_para,
      qtd_alunos: values.substituicoes_INTERMEDIARIO.numero_de_alunos,
    });
  }

  if (temPeriodosEscolares(values)) return "Obrigatório ao menos um período";

  if (
    meusDados.vinculo_atual.instituicao.tipo_unidade_escolar_iniciais !==
      "CEU GESTAO" &&
    meusDados.vinculo_atual.instituicao.tipo_unidade_escolar_iniciais !==
      "CMCT" &&
    totalAlunos > meusDados.vinculo_atual.instituicao.quantidade_alunos
  ) {
    return "Número de alunos do pedido maior que a quantidade de alunos da escola";
  } else {
    delete values["substituicoes_MANHA"];
    delete values["substituicoes_TARDE"];
    delete values["substituicoes_NOITE"];
    delete values["substituicoes_INTEGRAL"];
    delete values["substituicoes_VESPERTINO"];
    delete values["substituicoes_INTERMEDIARIO"];
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
function temPeriodosEscolares(values) {
  return values["substituicoes"].length === 0;
}
