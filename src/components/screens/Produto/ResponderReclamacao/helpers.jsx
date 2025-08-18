import moment from "moment";
import {
  usuarioEhCODAEGabinete,
  usuarioEhCODAEGestaoAlimentacao,
  usuarioEhCoordenadorNutriSupervisao,
  usuarioEhOrgaoFiscalizador,
} from "src/helpers/utilities";

export const ordenaLogs = (logs) => {
  const sortedLogs = logs
    .concat()
    .sort((a, b) => moment(a.criado_em) - moment(b.criado_em));
  return sortedLogs;
};

export const getReclamacao = (logs) => {
  return logs.find(
    (log) =>
      log.status_evento_explicacao ===
      "Escola/Nutricionista reclamou do produto"
  );
};

export const getQuestionamentoCodae = (logs) => {
  return logs.find(
    (log) =>
      log.status_evento_explicacao === "CODAE pediu análise da reclamação"
  );
};

export const getStatus = (values) => {
  const status = [
    "CODAE_PEDIU_ANALISE_RECLAMACAO",
    "TERCEIRIZADA_RESPONDEU_RECLAMACAO",
  ];
  if (
    usuarioEhOrgaoFiscalizador() ||
    usuarioEhCoordenadorNutriSupervisao() ||
    usuarioEhCODAEGestaoAlimentacao() ||
    usuarioEhCODAEGabinete()
  ) {
    status.push("ESCOLA_OU_NUTRICIONISTA_RECLAMOU");
    status.push("CODAE_QUESTIONOU_UE");
    status.push("CODAE_QUESTIONOU_NUTRISUPERVISOR");
    status.push("UE_RESPONDEU_QUESTIONAMENTO");
    status.push("NUTRISUPERVISOR_RESPONDEU_QUESTIONAMENTO");
  }
  return {
    ...values,
    status,
  };
};
