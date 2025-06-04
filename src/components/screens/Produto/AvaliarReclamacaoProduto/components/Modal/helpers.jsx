export const getMensagemSucesso = (tituloModal) => {
  switch (tituloModal) {
    case "Questionar terceirizada":
      return "Questionamento da terceirizada realizado com sucesso";
    case "Recusar reclamação":
      return "Reclamação recusada com sucesso";
    case "Aceitar reclamação":
      return "Reclamação aceita com sucesso";
    default:
      return "Operação realizada com sucesso";
  }
};
