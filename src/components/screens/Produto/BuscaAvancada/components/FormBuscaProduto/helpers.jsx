import { TIPO_PERFIL } from "src/constants/shared";

export const getOpecoesStatus = () => {
  const tipoPerfil = localStorage.getItem("tipo_perfil");
  if (
    tipoPerfil === TIPO_PERFIL.TERCEIRIZADA ||
    tipoPerfil === TIPO_PERFIL.GESTAO_PRODUTO
  ) {
    return [
      "Todos",
      "Reclamações de produtos",
      "Produtos Suspensos",
      "Correções de Produtos",
      "Aguardando análise das reclamações",
      "Aguardando análise sensoriais",
      "Pendente de homologação",
      "Homologado",
      "Não homologado",
    ];
  } else {
    return [
      "Todos",
      "Homologado",
      "Não homologado",
      "Produtos Suspensos",
      "Reclamações de produtos",
    ];
  }
};

export const retornaStatusBackend = (status) => {
  switch (status) {
    case "Reclamações de produtos":
      return "CODAE_AUTORIZOU_RECLAMACAO";
    case "Produtos Suspensos":
      return "CODAE_SUSPENDEU";
    case "Correções de Produtos":
      return "CODAE_QUESTIONADO";
    case "Aguardando análise das reclamações":
      return "CODAE_PEDIU_ANALISE_RECLAMACAO";
    case "Aguardando análise sensoriais":
      return "CODAE_PEDIU_ANALISE_SENSORIAL";
    case "Pendente de homologação":
      return "CODAE_PENDENTE_HOMOLOGACAO";
    case "Homologado":
      return "CODAE_HOMOLOGADO";
    case "Não homologado":
      return "CODAE_NAO_HOMOLOGADO";
    default:
      return "STATUS NÃO ENCONTRADO";
  }
};
