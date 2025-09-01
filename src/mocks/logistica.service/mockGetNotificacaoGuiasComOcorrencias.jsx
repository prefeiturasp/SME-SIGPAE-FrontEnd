export const mockNotificacao = {
  uuid: "test-uuid",
  numero: "NOT-001",
  empresa: {
    nome_fantasia: "Empresa Teste",
  },
  processo_sei: "12345",
  previsoes_contratuais: [
    {
      motivo_ocorrencia: "VALIDADE_EXPIRADA",
      previsao_contratual: "Previsão teste",
    },
  ],
  guias_notificadas: [
    {
      numero_guia: "GUIA-001",
      conferencias: [
        {
          conferencia_dos_alimentos: [
            {
              ocorrencia: ["VALIDADE_EXPIRADA", "AUSENCIA_PRODUTO"],
            },
          ],
        },
      ],
    },
  ],
};
