export const tipoDeStatus = status => {
  switch (status) {
    case "Cronograma Criado":
    case "Assinado e Enviado ao Fornecedor":
    case "Assinado Fornecedor":
    case "Assinado Dinutre":
    case "Assinado CODAE":
    case "Em Análise":
    case "Cronograma Ciente":
    case "Aprovado DINUTRE":
    case "Aprovado DILOG":
      return "aprovado";

    case "Alteração Fornecedor":
    case "Reprovado DILOG":
      return "alterado";

    case "Reprovado DINUTRE":
      return "reprovado";

    default:
      return "";
  }
};

export const tipoDeStatusClasse = status => {
  return tipoDeStatus(status.status_evento_explicacao) === "aprovado"
    ? "active"
    : tipoDeStatus(status.status_evento_explicacao) === "reprovado"
    ? "disapproved"
    : tipoDeStatus(status.status_evento_explicacao) === "alterado"
    ? "questioned"
    : tipoDeStatus(status.status_evento_explicacao) === "cancelado"
    ? "cancelled"
    : "pending";
};
