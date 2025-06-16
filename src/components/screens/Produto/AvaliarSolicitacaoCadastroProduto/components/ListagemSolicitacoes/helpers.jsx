export const retornaStatusFormatado = (status) => {
  switch (status) {
    case "CODAE_AUTORIZOU_RECLAMACAO":
      return "Reclamação de produto";
    case "CODAE_SUSPENDEU":
      return "Produtos Suspensos";
    case "CODAE_QUESTIONADO":
      return "Correções de Produtos";
    case "CODAE_PEDIU_ANALISE_RECLAMACAO":
      return "Aguardando análise das reclamações";
    case "CODAE_PEDIU_ANALISE_SENSORIAL":
      return "Aguardando análise sensoriais";
    case "CODAE_PENDENTE_HOMOLOGACAO":
      return "Pendente de homologação";
    case "CODAE_HOMOLOGADO":
      return "Homologado";
    case "CODAE_NAO_HOMOLOGADO":
      return "Não homologado";
    case "ESCOLA_OU_NUTRICIONISTA_RECLAMOU":
      return "Escola ou nutricionista reclamou";
    case "TERCEIRIZADA_RESPONDEU_RECLAMACAO":
      return "Terceirizada respondeu a reclamação";
    default:
      return "Todos";
  }
};
