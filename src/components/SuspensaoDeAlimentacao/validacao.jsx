import {
  escolaEhCEMEI,
  usuarioEhEscolaSemAlunosRegulares,
} from "src/helpers/utilities";

const PERIODOS_SUSPENSAO = [
  "MANHA",
  "TARDE",
  "NOITE",
  "INTEGRAL",
  "VESPERTINO",
  "INTERMEDIARIO",
];

const montarSuspensao = (suspensoesPeriodo) => {
  const objSuspensoes = {
    periodo_escolar: suspensoesPeriodo.periodo,
    tipos_alimentacao: suspensoesPeriodo.tipo_de_refeicao,
    numero_alunos: suspensoesPeriodo.numero_de_alunos,
  };
  if (escolaEhCEMEI()) {
    objSuspensoes["alunos_cei_ou_emei"] =
      suspensoesPeriodo.alunos_cei_ou_emei.length === 1
        ? suspensoesPeriodo.alunos_cei_ou_emei[0]
        : "Todos";
  }
  return objSuspensoes;
};

const adicionarSuspensaoDoPeriodo = (values, suspensoesPeriodo) => {
  if (!suspensoesPeriodo || !suspensoesPeriodo.check) {
    return 0;
  }
  const numeroAlunos = parseInt(suspensoesPeriodo.numero_de_alunos);
  values["suspensoes"].push(montarSuspensao(suspensoesPeriodo));
  return numeroAlunos;
};

export const validateSubmit = (values, meusDados) => {
  values["suspensoes"] = [];
  let totalAlunos = 0;

  PERIODOS_SUSPENSAO.forEach((periodo) => {
    totalAlunos += adicionarSuspensaoDoPeriodo(
      values,
      values[`suspensoes_${periodo}`],
    );
  });

  if (
    !usuarioEhEscolaSemAlunosRegulares() &&
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
