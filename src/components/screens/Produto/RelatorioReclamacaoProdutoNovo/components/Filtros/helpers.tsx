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
