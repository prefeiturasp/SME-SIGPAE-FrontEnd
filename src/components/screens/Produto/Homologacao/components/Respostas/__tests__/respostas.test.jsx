import { render, screen } from "@testing-library/react";
import Respostas from "..";
import { mockHomologacao } from "src/mocks/Produto/Homologacao/mockHomologacao";

const criarHomologacaoComLogs = (logs) => ({
  ...mockHomologacao,
  logs,
});

const logSuspensao = {
  anexos: [],
  status_evento_explicacao: "CODAE suspendeu o produto",
  criado_em: "10/08/2023 18:23:44",
  justificativa: "<p>Suspendeu produto</p>",
  resposta_sim_nao: false,
  tipo_solicitacao_explicacao: "Homologação de Produto",
  ativo: false,
};

const logManteveSuspenso = {
  anexos: [],
  status_evento_explicacao: "CODAE manteve o produto suspenso",
  criado_em: "03/09/2026 10:00:00",
  justificativa: "<p>Manteve o produto suspenso</p>",
  resposta_sim_nao: false,
  tipo_solicitacao_explicacao: "Homologação de Produto",
  ativo: false,
};

describe("Teste de componente retorno de repostas da homologação", () => {
  it("deve renderizar o componente", () => {
    render(
      <Respostas homologacao={mockHomologacao} logAnaliseSensorial={[]} />,
    );
    expect(
      screen.getByText("Motivo da suspensão (Data: 10/08/2023)"),
    ).toBeInTheDocument();
  });

  it("deve renderizar a data e justificativa do último log de suspensão", () => {
    render(
      <Respostas
        homologacao={criarHomologacaoComLogs([
          logSuspensao,
          logManteveSuspenso,
        ])}
        logAnaliseSensorial={[]}
      />,
    );
    expect(
      screen.getByText("Motivo da suspensão (Data: 03/09/2026)"),
    ).toBeInTheDocument();
    expect(screen.getByText("Manteve o produto suspenso")).toBeInTheDocument();
  });

  it("deve renderizar o log de suspensão quando não há log de manter suspenso", () => {
    render(
      <Respostas
        homologacao={criarHomologacaoComLogs([logSuspensao])}
        logAnaliseSensorial={[]}
      />,
    );
    expect(
      screen.getByText("Motivo da suspensão (Data: 10/08/2023)"),
    ).toBeInTheDocument();
    expect(screen.getByText("Suspendeu produto")).toBeInTheDocument();
  });
});
