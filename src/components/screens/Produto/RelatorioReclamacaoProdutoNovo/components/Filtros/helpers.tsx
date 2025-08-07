import { IFormValues } from "../../interfaces";

export const getOpcoesStatusReclamacao = (): Array<{
  label: string;
  value: string;
}> => {
  return [
    {
      value: "AGUARDANDO_AVALIACAO",
      label: "Aguardando avaliação da CODAE",
    },
    {
      value: "AGUARDANDO_RESPOSTA_TERCEIRIZADA",
      label: "Aguardando resposta da terceirizada",
    },
    {
      value: "RESPONDIDO_TERCEIRIZADA",
      label: "Respondido pela terceirizada",
    },
    { value: "CODAE_ACEITOU", label: "CODAE aceitou" },
    { value: "CODAE_RECUSOU", label: "CODAE recusou" },
    { value: "CODAE_RESPONDEU", label: "CODAE respondeu" },
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

export const formatarValues = (values: IFormValues) => {
  const formValues = { ...values };
  if (!values.status_reclamacao || values.status_reclamacao.length === 0) {
    formValues.status_reclamacao = getTodosStatusReclamacao();
  }
  return formValues;
};
