import { deepCopy } from "../../../helpers/utilities";

export const fluxoPartindoEscola = [
  {
    titulo: "Solicitação Realizada",
    status: "",
    criado_em: "",
    usuario: null
  },
  {
    titulo: "DRE",
    status: "",
    criado_em: "",
    usuario: null
  },
  {
    titulo: "CODAE",
    status: "",
    criado_em: "",
    usuario: null
  }
];

export const fluxoDietaEspecialPartindoEscola = [
  {
    titulo: "Solicitação Realizada",
    status: "",
    criado_em: "",
    usuario: null
  },
  {
    titulo: "CODAE",
    status: "",
    criado_em: "",
    usuario: null
  }
];

export const fluxoDietaEspecialComInativacao = [
  {
    titulo: "Escola solicitou cancelamento",
    status: "",
    criado_em: "",
    usuario: null
  },
  {
    titulo: "CODAE",
    status: "",
    criado_em: "",
    usuario: null
  }
];

export const fluxoPartindoDRE = [
  {
    titulo: "Solicitação Realizada",
    status: "",
    criado_em: "",
    usuario: null
  },
  {
    titulo: "CODAE",
    status: "",
    criado_em: "",
    usuario: null
  }
];

export const fluxoInformativoPartindoEscola = [
  {
    titulo: "Solicitação Realizada",
    status: "",
    criado_em: "",
    usuario: null
  }
];

export const fluxoPartindoTerceirizada = [
  {
    titulo: "Solicitação Realizada",
    status: "",
    criado_em: "",
    usuario: null
  },
  {
    titulo: "CODAE",
    status: "",
    criado_em: "",
    usuario: null
  }
];

export const tipoDeStatus = status => {
  switch (status) {
    case "Solicitação Realizada":
    case "Escola revisou":
    case "DRE validou":
    case "DRE revisou":
    case "Homologado":
    case "CODAE autorizou":
    case "Terceirizada respondeu a análise":
      return "prosseguiu";
    case "CODAE homologou":
      return "prosseguiu";
    case "CODAE não homologou":
    case "CODAE cancelou análise sensorial":
      return "cancelado";
    case "CODAE pediu correção":
    case "Terceirizada respondeu questionamento":
      return "questionado";
    case "Terceirizada tomou ciência":
    case "Escola solicitou cancelamento":
    case "CODAE autorizou cancelamento":
    case "Terceirizada tomou ciência do cancelamento":
      return "prosseguiu";
    case "Escola cancelou":
    case "DRE cancelou":
    case "Cancelada por atingir data de término":
    case "Cancelamento por alteração de unidade educacional":
    case "Cancelamento para aluno não matriculado na rede municipal":
      return "cancelado";
    case "DRE não validou":
    case "CODAE negou":
    case "CODAE negou cancelamento":
    case "Terceirizada recusou":
      return "reprovado";
    case "Questionamento pela CODAE":
      return "questionado";
    case "CODAE pediu análise sensorial":
      return "questionado";
    default:
      return "";
  }
};

export const tipoDeStatusClasse = status => {
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

export const existeAlgumStatusFimDeFluxo = logs => {
  return (
    logs.findIndex(
      log =>
        log.status_evento_explicacao.includes("neg") ||
        log.status_evento_explicacao.includes("não") ||
        log.status_evento_explicacao.includes("cancel") ||
        log.status_evento_explicacao.includes("Terminada")
    ) === -1
  );
};

export const formatarLogs = logs => {
  return deepCopy(logs);
};
