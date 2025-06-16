import { TIPO_PERFIL } from "src/constants/shared";

export const retornaStatusFormatado = (status) => {
  const tipoPerfil = localStorage.getItem("tipo_perfil");
  switch (status) {
    case "CODAE_AUTORIZOU_RECLAMACAO":
      return "Reclamação de produto";
    case "CODAE_SUSPENDEU":
      return "Produtos Suspensos";
    case "CODAE_QUESTIONADO":
      return "Correções de Produtos";
    case "CODAE_PEDIU_ANALISE_RECLAMACAO": {
      if (
        tipoPerfil !== TIPO_PERFIL.GESTAO_PRODUTO &&
        tipoPerfil !== TIPO_PERFIL.TERCEIRIZADA
      )
        return "Homologado";
      return "Aguardando análise das reclamações";
    }
    case "CODAE_PEDIU_ANALISE_SENSORIAL":
      return "Aguardando análise sensoriais";
    case "CODAE_PENDENTE_HOMOLOGACAO":
      return "Pendente de homologação";
    case "CODAE_HOMOLOGADO":
      return "Homologado";
    case "CODAE_NAO_HOMOLOGADO":
      return "Não homologado";
    case "ESCOLA_OU_NUTRICIONISTA_RECLAMOU": {
      if (tipoPerfil === TIPO_PERFIL.GESTAO_PRODUTO)
        return "Aguardando análise das reclamações";
      return "Homologado";
    }
    case "TERCEIRIZADA_RESPONDEU_RECLAMACAO":
      if (tipoPerfil === TIPO_PERFIL.GESTAO_PRODUTO)
        return "Aguardando análise das reclamações";

      return "Homologado";
    default:
      return "Todos";
  }
};
