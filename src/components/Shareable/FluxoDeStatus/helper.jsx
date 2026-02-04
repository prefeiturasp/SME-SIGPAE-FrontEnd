import { deepCopy } from "../../../helpers/utilities";

export const fluxoPartindoEscola = [
  {
    titulo: "Solicitação Realizada",
    status: "",
    criado_em: "",
    usuario: null,
  },
  {
    titulo: "DRE",
    status: "",
    criado_em: "",
    usuario: null,
  },
  {
    titulo: "CODAE",
    status: "",
    criado_em: "",
    usuario: null,
  },
];

export const fluxoDietaEspecialPartindoEscola = [
  {
    titulo: "Solicitação Realizada",
    status: "",
    criado_em: "",
    usuario: null,
  },
  {
    titulo: "CODAE",
    status: "",
    criado_em: "",
    usuario: null,
  },
];

export const fluxoDietaEspecialComInativacao = [
  {
    titulo: "Escola solicitou cancelamento",
    status: "",
    criado_em: "",
    usuario: null,
  },
  {
    titulo: "CODAE",
    status: "",
    criado_em: "",
    usuario: null,
  },
];

export const fluxoPartindoDRE = [
  {
    titulo: "Solicitação Realizada",
    status: "",
    criado_em: "",
    usuario: null,
  },
  {
    titulo: "CODAE",
    status: "",
    criado_em: "",
    usuario: null,
  },
];

export const fluxoInformativoPartindoEscola = [
  {
    titulo: "Solicitação Realizada",
    status: "",
    criado_em: "",
    usuario: null,
  },
];

export const fluxoPartindoTerceirizada = [
  {
    titulo: "Solicitação Realizada",
    status: "",
    criado_em: "",
    usuario: null,
  },
  {
    titulo: "CODAE",
    status: "",
    criado_em: "",
    usuario: null,
  },
];

export const fluxoMedicaoInicial = [
  {
    titulo: "Solicitação de Medição não Iniciada",
    status: "",
    criado_em: "",
    usuario: null,
    status_evento_explicacao: "Solicitação de Medição não Iniciada",
  },
];

export const tipoDeStatus = (status) => {
  switch (status) {
    case "Solicitação Realizada":
    case "Escola revisou":
    case "DRE validou":
    case "DRE revisou":
    case "Homologado":
    case "CODAE autorizou":
    case "Terceirizada respondeu a análise":
    case "Terceirizada tomou ciência":
    case "Escola solicitou cancelamento":
    case "CODAE autorizou cancelamento":
    case "Terceirizada tomou ciência do cancelamento":
    case "CODAE suspendeu o produto":
    case "Em aberto para preenchimento pela UE":
    case "Enviado pela UE":
    case "Aprovado pela DRE":
    case "Aprovado pela CODAE":
    case "CODAE homologou":
    case "CODAE Atualizou o protocolo":
    case "Corrigido para DRE":
    case "Corrigido para CODAE":
    case "Solicitação de Alteração de UE Realizada":
    case "CODAE autorizou a Alteração de UE":
      return "prosseguiu";

    case "CODAE pediu correção":
    case "Questionamento pela CODAE":
    case "Terceirizada respondeu questionamento":
    case "CODAE pediu análise sensorial":
    case "Suspenso em alguns editais":
    case "Ativo em alguns editais":
    case "Vínculo do Edital ao Produto":
    case "Correção solicitada":
    case "Correção solicitada pela CODAE":
      return "questionado";

    case "Escola cancelou":
    case "DRE cancelou":
    case "Cancelada por atingir data de término":
    case "Cancelamento por alteração de unidade educacional":
    case "Cancelamento para aluno não matriculado na rede municipal":
    case "CODAE cancelou análise sensorial":
    case "CODAE cancelou solicitação de correção":
    case "Terceirizada cancelou solicitação de correção":
    case "CODAE autorizou o cancelamento":
    case "CODAE inativou":
      return "cancelado";

    case "DRE não validou":
    case "CODAE negou":
    case "CODAE negou cancelamento":
    case "Terceirizada recusou":
    case "CODAE não homologou":
    case "CODAE negou a Alteração de UE":
      return "reprovado";

    default:
      return "";
  }
};

export const tipoDeStatusClasse = (status) => {
  return tipoDeStatus(status.status_evento_explicacao) === "prosseguiu"
    ? "active"
    : tipoDeStatus(status.status_evento_explicacao) === "reprovado"
      ? "disapproved"
      : tipoDeStatus(status.status_evento_explicacao) === "questionado"
        ? "questioned"
        : tipoDeStatus(status.status_evento_explicacao) === "cancelado"
          ? "cancelled"
          : "pending";
};

export const formatarFluxoDietaEspecial = () => {
  return fluxoDietaEspecialComInativacao;
};

export const existeAlgumStatusFimDeFluxo = (logs) => {
  return (
    logs.findIndex(
      (log) =>
        log.status_evento_explicacao.includes("neg") ||
        log.status_evento_explicacao.includes("não") ||
        log.status_evento_explicacao.includes("cancel") ||
        log.status_evento_explicacao.includes("Terminada"),
    ) === -1
  );
};

export const formatarLogs = (logs) => {
  return deepCopy(logs);
};
