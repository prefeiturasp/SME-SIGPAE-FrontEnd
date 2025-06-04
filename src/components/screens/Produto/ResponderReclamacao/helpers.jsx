import moment from "moment";
import * as R from "ramda";
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
  const arr = R.filter(
    R.propEq(
      "status_evento_explicacao",
      "Escola/Nutricionista reclamou do produto"
    ),
    logs
  );
  return arr[0];
};

export const getQuestionamentoCodae = (logs) => {
  const arr = R.filter(
    R.propEq("status_evento_explicacao", "CODAE pediu análise da reclamação"),
    logs
  );
  return arr[0];
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
