import { TIPO_PERFIL } from "src/constants/shared";

export const getOpcoesStatusReclamacao = () => {
  return [
    { disabled: true, value: "Selecione", option: "Selecione" },
    {
      disabled: false,
      value: "AGUARDANDO_AVALIACAO",
      option: "Aguardando avaliação da CODAE",
    },
    {
      disabled: false,
      value: "AGUARDANDO_RESPOSTA_TERCEIRIZADA",
      option: "Aguardando resposta da terceirizada",
    },
    {
      disabled: false,
      value: "RESPONDIDO_TERCEIRIZADA",
      option: "Respondido pela terceirizada",
    },
    { disabled: false, value: "CODAE_ACEITOU", option: "CODAE aceitou" },
    { disabled: false, value: "CODAE_RECUSOU", option: "CODAE recusou" },
    { disabled: false, value: "CODAE_RESPONDEU", option: "CODAE respondeu" },
  ];
};

export const getTodosStatusReclamacao = () => {
  return [
    "AGUARDANDO_AVALIACAO",
    "AGUARDANDO_RESPOSTA_TERCEIRIZADA",
    "RESPONDIDO_TERCEIRIZADA",
    "AGUARDANDO_ANALISE_SENSORIAL",
    "ANALISE_SENSORIAL_RESPONDIDA",
    "AGUARDANDO_RESPOSTA_UE",
    "RESPONDIDO_UE",
    "AGUARDANDO_RESPOSTA_NUTRISUPERVISOR",
    "RESPONDIDO_NUTRISUPERVISOR",
    "CODAE_ACEITOU",
    "CODAE_RECUSOU",
    "CODAE_RESPONDEU",
  ];
};

export const getTodasOpcoesStatusPorPerfil = () => {
  const tipoPerfil = localStorage.getItem("tipo_perfil");
  if (
    tipoPerfil === TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA ||
    tipoPerfil === TIPO_PERFIL.TERCEIRIZADA
  ) {
    return [
      "CODAE_AUTORIZOU_RECLAMACAO",
      "CODAE_SUSPENDEU",
      "CODAE_QUESTIONADO",
      "CODAE_PEDIU_ANALISE_RECLAMACAO",
      "CODAE_PEDIU_ANALISE_SENSORIAL",
      "CODAE_PENDENTE_HOMOLOGACAO",
      "CODAE_HOMOLOGADO",
      "CODAE_NAO_HOMOLOGADO",
    ];
  } else if (tipoPerfil === TIPO_PERFIL.GESTAO_PRODUTO) {
    return [
      "CODAE_AUTORIZOU_RECLAMACAO",
      "CODAE_SUSPENDEU",
      "CODAE_PEDIU_ANALISE_RECLAMACAO",
      "CODAE_PEDIU_ANALISE_SENSORIAL",
      "CODAE_PENDENTE_HOMOLOGACAO",
      "CODAE_HOMOLOGADO",
      "CODAE_NAO_HOMOLOGADO",
    ];
  } else {
    return [
      "CODAE_HOMOLOGADO",
      "CODAE_NAO_HOMOLOGADO",
      "CODAE_SUSPENDEU",
      "CODAE_AUTORIZOU_RECLAMACAO",
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
      return "STATUS NAO ENCONTRADO";
  }
};
