import {
  ehEscolaTipoCEMEI,
  capitalize,
} from "../../../../../../helpers/utilities";

export const ehEmeiDaCemei = (
  escolaInstituicao,
  periodosEscolaCemeiComAlunosEmei,
  nomeGrupo
) => {
  return (
    ehEscolaTipoCEMEI(escolaInstituicao) &&
    periodosEscolaCemeiComAlunosEmei.includes(nomeGrupo)
  );
};

export const textoCabecalhoFormatado = (textoCabecalho) => {
  switch (textoCabecalho) {
    case "MANHA":
      return "Infantil Manhã";
    case "TARDE":
      return "Infantil Tarde";
    case "PARCIAL":
      return "Período Parcial";
    case "INTEGRAL":
      return "Período Integral";
    case "Infantil INTEGRAL":
      return "Infantil Integral";
    case "Infantil MANHA":
      return "Infantil Manhã";
    case "Infantil TARDE":
      return "Infantil Tarde";
    case "Solicitações de Alimentação":
      return "Solicitações de Alimentação - Infantil";
    default:
      return textoCabecalho;
  }
};

export const numeroRefeicoesDiarias = (textoCabecalho) => {
  switch (textoCabecalho) {
    case "PARCIAL":
      return 3;
    case "INTEGRAL":
      return 5;
    default:
      return 2;
  }
};

export const formataPeriodosCEMEI = (periodo) => {
  switch (periodo) {
    case "INTEGRAL":
      return "Período Integral";
    case "PARCIAL":
      return "Período Parcial";
    case "Infantil MANHA":
      return "Infantil Manhã";
    case "Infantil TARDE":
      return "Infantil Tarde";
    case "Infantil INTEGRAL":
      return "Infantil Integral";
    default:
      return capitalize(periodo);
  }
};

export const formataPeriodosCEI = (periodo) => {
  switch (periodo) {
    case "INTEGRAL":
      return "Período Integral";
    case "PARCIAL":
      return "Período Parcial";
    case "MANHA":
      return "Manhã";
    default:
      return capitalize(periodo);
  }
};
