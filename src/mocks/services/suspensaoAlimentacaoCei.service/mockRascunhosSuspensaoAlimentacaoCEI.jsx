export const mockRascunhosSuspensaoAlimentacaoCEI = {
  count: 2,
  next: null,
  previous: null,
  results: [
    {
      uuid: "1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d",
      id_externo: "1A2B3",
      status: "RASCUNHO",
      criado_em: "20/01/2025 10:15:00",
      data: "31/01/2025",
      motivo: {
        nome: "Unidade sem atendimento",
        uuid: "c80130a5-17a0-4c1a-9334-7abf55cebd3e",
      },
      outro_motivo: "",
      observacao: "<p>Unidade fechada para manutenção</p>",
      periodos_escolares: [
        {
          possui_alunos_regulares: true,
          nome: "INTEGRAL",
          uuid: "e17e2405-36be-4981-a09c-35c89ae0f8b7",
          posicao: 1,
          tipo_turno: 6,
        },
      ],
    },
    {
      uuid: "9f8e7d6c-5b4a-4392-8170-6f5e4d3c2b1a",
      id_externo: "9F8E7",
      status: "SALVO",
      criado_em: "21/01/2025 14:30:00",
      data: "03/02/2025",
      motivo: {
        nome: "Outro",
        uuid: "8f7b0b56-2f0e-4c4c-9b1e-6f1c2d3e4a5b",
      },
      outro_motivo: "Dedetização da cozinha",
      observacao: "",
      periodos_escolares: [
        {
          possui_alunos_regulares: true,
          nome: "MANHA",
          uuid: "5067e137-e5f3-4876-a63f-7f58cce93f33",
          posicao: 2,
          tipo_turno: 1,
        },
        {
          possui_alunos_regulares: true,
          nome: "TARDE",
          uuid: "20bd9ca9-d499-456a-bd86-fb8f297947d6",
          posicao: 3,
          tipo_turno: 3,
        },
      ],
    },
  ],
};
