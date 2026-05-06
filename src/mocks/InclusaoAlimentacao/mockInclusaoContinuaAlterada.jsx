import { mockInclusaoContinuaPrazoLimite } from "./mockInclusaoContinuaPrazoLimite";

const usuarioEscola = {
  uuid: "36750ded-5790-433e-b765-0507303828df",
  cpf: null,
  nome: "SUPER USUARIO ESCOLA EMEF",
  email: "escolaemef@admin.com",
  date_joined: "10/07/2020 13:15:23",
  registro_funcional: "8115257",
  tipo_usuario: "escola",
  cargo: "ANALISTA DE SAUDE NIVEL II",
  crn_numero: null,
  nome_fantasia: null,
};

export const mockInclusaoContinuaAlterada = {
  ...mockInclusaoContinuaPrazoLimite,
  status: "CODAE_AUTORIZADO",
  quantidades_periodo: [
    {
      ...mockInclusaoContinuaPrazoLimite.quantidades_periodo[0],
      encerrado_a_partir_de: "31/10/2025",
      cancelado_justificativa:
        "O projeto não será mais ofertado no período da manhã.",
    },
    {
      ...mockInclusaoContinuaPrazoLimite.quantidades_periodo[0],
      uuid: "1234abcd-0000-0000-0000-000000000001",
      periodo_escolar: {
        ...mockInclusaoContinuaPrazoLimite.quantidades_periodo[0]
          .periodo_escolar,
        nome: "TARDE",
        uuid: "20bd9ca9-d499-456a-bd86-fb8f297947d6",
      },
      encerrado_a_partir_de: "15/11/2025",
      cancelado_justificativa: "Encerramento do projeto no período da tarde.",
    },
  ],
  logs: [
    ...mockInclusaoContinuaPrazoLimite.logs,
    {
      status_evento_explicacao: "Escola alterou",
      usuario: usuarioEscola,
      criado_em: "07/10/2025 15:00:08",
      descricao:
        "de 2025-03-05 até 2025-03-12 para 017981: EMEF PERICLES EUGENIO DA SILVA RAMOS",
      justificativa: "O projeto não será mais ofertado no período da manhã.",
      resposta_sim_nao: false,
    },
    {
      status_evento_explicacao: "Escola alterou",
      usuario: usuarioEscola,
      criado_em: "07/10/2025 15:00:18",
      descricao:
        "de 2025-03-05 até 2025-03-12 para 017981: EMEF PERICLES EUGENIO DA SILVA RAMOS",
      justificativa: "Encerramento do projeto no período da tarde.",
      resposta_sim_nao: false,
    },
  ],
};
