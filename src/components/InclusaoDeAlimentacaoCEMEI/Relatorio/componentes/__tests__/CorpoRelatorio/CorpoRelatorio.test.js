import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CorpoRelatorio } from "../../CorpoRelatorio";

jest.mock("components/Shareable/FluxoDeStatus", () => ({
  FluxoDeStatus: () => <div data-testid="fluxo-status">FluxoDeStatus</div>,
}));

jest.mock("components/Shareable/RelatorioHistoricoQuestionamento", () => () => (
  <div data-testid="historico-questionamento">HistoricoQuestionamento</div>
));

jest.mock(
  "components/Shareable/RelatorioHistoricoJustificativaEscola",
  () => () => <div data-testid="justificativa-escola">JustificativaEscola</div>
);

jest.mock("components/Shareable/SolicitacoesSimilaresInclusao", () => ({
  SolicitacoesSimilaresInclusao: () => (
    <div data-testid="similares">Similares</div>
  ),
}));

jest.mock("services/relatorios", () => ({
  getRelatorioInclusaoAlimentacaoCEMEI: jest.fn(() => Promise.resolve()),
}));

jest.mock("components/Shareable/Toast/dialogs", () => ({
  toastError: jest.fn(),
}));

jest.mock("helpers/utilities", () => ({
  corDaMensagem: () => "verde",
  justificativaAoNegarSolicitacao: () => "Justificativa mock",
  prazoDoPedidoMensagem: () => "Mensagem de prazo",
  gerarLinkRelatorio: () => "#",
  usuarioEhCODAEGestaoAlimentacao: () => true,
  usuarioEhDRE: () => false,
}));

jest.mock("components/InclusaoDeAlimentacaoCEMEI/helpers", () => ({
  tiposAlimentacaoPorPeriodoETipoUnidade: () => "Tipo A, Tipo B",
  inclusaoPossuiCEInestePeriodo: () => true,
  inclusaoPossuiEMEInestePeriodo: () => false,
  periodosDaInclusao: () => ["Manhã"],
}));

jest.mock(
  "components/InclusaoDeAlimentacao/Relatorio/componentes/helper",
  () => ({
    formataMotivosDiasComOutros: () => ({ MotivoX: ["2023-12-01"] }),
  })
);

jest.mock("components/Shareable/ToggleExpandir", () => ({
  ToggleExpandir: () => <button data-testid="toggle">Toggle</button>,
}));

afterEach(() => cleanup());

describe("CorpoRelatorio", () => {
  const solicitacaoMock = {
    prioridade: "Alta",
    id_externo: "001",
    uuid: "uuid-mock",
    escola: {
      nome: "Escola Teste",
      codigo_eol: "123456",
      diretoria_regional: { nome: "DRE Norte" },
      lote: { nome: "Lote A" },
      tipo_gestao: { nome: "Direta" },
    },
    rastro_terceirizada: { nome_fantasia: "Empresa X" },
    logs: [
      {
        status_evento_explicacao: "CODAE autorizou",
        criado_em: "2024-12-01",
        justificativa: "Autorizado",
      },
    ],
    dias_motivos_da_inclusao_cemei: [
      {
        data: "2023-12-01",
        cancelado: false,
        cancelado_justificativa: "Falta de energia",
        descricao_evento: "Evento A",
        outro_motivo: "Motivo alternativo",
      },
    ],
    quantidade_alunos_cei_da_inclusao_cemei: [
      {
        periodo_escolar: { nome: "Manhã" },
        faixa_etaria: { __str__: "2 anos" },
        matriculados_quando_criado: 10,
        quantidade_alunos: 5,
      },
    ],
    quantidade_alunos_emei_da_inclusao_cemei: [
      {
        periodo_escolar: { nome: "Manhã" },
        tipos_alimentacao: [{ nome: "Tipo A" }],
        matriculados_quando_criado: 20,
        quantidade_alunos: 10,
      },
    ],
    status: "CODAE_AUTORIZADO",
  };

  const vinculosMock = [
    { nome: "Manhã", tipos_alimentacao: [{ nome: "Tipo A" }] },
  ];

  test("Renderiza corretamente o componente", async () => {
    render(
      <CorpoRelatorio
        solicitacao={solicitacaoMock}
        vinculos={vinculosMock}
        ehMotivoEspecifico={false}
        solicitacoesSimilares={[]}
      />
    );

    expect(screen.getByText("Mensagem de prazo")).toBeInTheDocument();

    expect(screen.getByText("Escola Teste")).toBeInTheDocument();

    expect(screen.getByText("Justificativa da negação")).toBeInTheDocument();

    expect(screen.getByTestId("fluxo-status")).toBeInTheDocument();

    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
