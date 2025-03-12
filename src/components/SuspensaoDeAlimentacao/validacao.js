import {
  escolaEhCEMEI,
  usuarioEhEscolaCeuGestao,
  usuarioEhEscolaCMCT,
} from "helpers/utilities";

export const validateSubmit = (values, meusDados) => {
  values["suspensoes"] = [];
  let totalAlunos = 0;

  if (values.suspensoes_MANHA && values.suspensoes_MANHA.check) {
    totalAlunos += parseInt(values.suspensoes_MANHA.numero_de_alunos);
    let objSuspensoes = {
      periodo_escolar: values.suspensoes_MANHA.periodo,
      tipos_alimentacao: values.suspensoes_MANHA.tipo_de_refeicao,
      numero_alunos: values.suspensoes_MANHA.numero_de_alunos,
    };
    if (escolaEhCEMEI()) {
      objSuspensoes["alunos_cei_ou_emei"] =
        values.suspensoes_MANHA.alunos_cei_ou_emei.length === 1
          ? values.suspensoes_MANHA.alunos_cei_ou_emei[0]
          : "Todos";
    }
    values["suspensoes"].push(objSuspensoes);
  }

  if (values.suspensoes_TARDE && values.suspensoes_TARDE.check) {
    totalAlunos += parseInt(values.suspensoes_TARDE.numero_de_alunos);
    let objSuspensoes = {
      periodo_escolar: values.suspensoes_TARDE.periodo,
      tipos_alimentacao: values.suspensoes_TARDE.tipo_de_refeicao,
      numero_alunos: values.suspensoes_TARDE.numero_de_alunos,
    };
    if (escolaEhCEMEI()) {
      objSuspensoes["alunos_cei_ou_emei"] =
        values.suspensoes_TARDE.alunos_cei_ou_emei.length === 1
          ? values.suspensoes_TARDE.alunos_cei_ou_emei[0]
          : "Todos";
    }
    values["suspensoes"].push(objSuspensoes);
  }

  if (values.suspensoes_NOITE && values.suspensoes_NOITE.check) {
    totalAlunos += parseInt(values.suspensoes_NOITE.numero_de_alunos);
    let objSuspensoes = {
      periodo_escolar: values.suspensoes_NOITE.periodo,
      tipos_alimentacao: values.suspensoes_NOITE.tipo_de_refeicao,
      numero_alunos: values.suspensoes_NOITE.numero_de_alunos,
    };
    if (escolaEhCEMEI()) {
      objSuspensoes["alunos_cei_ou_emei"] =
        values.suspensoes_NOITE.alunos_cei_ou_emei.length === 1
          ? values.suspensoes_NOITE.alunos_cei_ou_emei[0]
          : "Todos";
    }
    values["suspensoes"].push(objSuspensoes);
  }

  if (values.suspensoes_INTEGRAL && values.suspensoes_INTEGRAL.check) {
    totalAlunos += parseInt(values.suspensoes_INTEGRAL.numero_de_alunos);
    let objSuspensoes = {
      periodo_escolar: values.suspensoes_INTEGRAL.periodo,
      tipos_alimentacao: values.suspensoes_INTEGRAL.tipo_de_refeicao,
      numero_alunos: values.suspensoes_INTEGRAL.numero_de_alunos,
    };
    if (escolaEhCEMEI()) {
      objSuspensoes["alunos_cei_ou_emei"] =
        values.suspensoes_INTEGRAL.alunos_cei_ou_emei.length === 1
          ? values.suspensoes_INTEGRAL.alunos_cei_ou_emei[0]
          : "Todos";
    }
    values["suspensoes"].push(objSuspensoes);
  }

  if (values.suspensoes_VESPERTINO && values.suspensoes_VESPERTINO.check) {
    totalAlunos += parseInt(values.suspensoes_VESPERTINO.numero_de_alunos);
    let objSuspensoes = {
      periodo_escolar: values.suspensoes_VESPERTINO.periodo,
      tipos_alimentacao: values.suspensoes_VESPERTINO.tipo_de_refeicao,
      numero_alunos: values.suspensoes_VESPERTINO.numero_de_alunos,
    };
    if (escolaEhCEMEI()) {
      objSuspensoes["alunos_cei_ou_emei"] =
        values.suspensoes_VESPERTINO.alunos_cei_ou_emei.length === 1
          ? values.suspensoes_VESPERTINO.alunos_cei_ou_emei[0]
          : "Todos";
    }
    values["suspensoes"].push(objSuspensoes);
  }

  if (
    values.suspensoes_INTERMEDIARIO &&
    values.suspensoes_INTERMEDIARIO.check
  ) {
    totalAlunos += parseInt(values.suspensoes_INTERMEDIARIO.numero_de_alunos);
    let objSuspensoes = {
      periodo_escolar: values.suspensoes_INTERMEDIARIO.periodo,
      tipos_alimentacao: values.suspensoes_INTERMEDIARIO.tipo_de_refeicao,
      numero_alunos: values.suspensoes_INTERMEDIARIO.numero_de_alunos,
    };
    if (escolaEhCEMEI()) {
      objSuspensoes["alunos_cei_ou_emei"] =
        values.suspensoes_INTERMEDIARIO.alunos_cei_ou_emei.length === 1
          ? values.suspensoes_INTERMEDIARIO.alunos_cei_ou_emei[0]
          : "Todos";
    }
    values["suspensoes"].push(objSuspensoes);
  }

  if (
    !usuarioEhEscolaCeuGestao() &&
    !usuarioEhEscolaCMCT() &&
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

  if (values["suspensoes"].length === 0)
    return "Obrigatório ao menos um período";
  return false;
};
