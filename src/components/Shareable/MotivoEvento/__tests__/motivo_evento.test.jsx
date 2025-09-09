import { render, screen } from "@testing-library/react";
import MotivoEvento from "src/components/Shareable/MotivoEvento";
import { mockHomologacaoLogs } from "src/mocks/Produto/Homologacao/mockHomologacaoLogs";

describe("Teste do componente de exibição do motivo do evento", () => {
  it("deve renderizar o componente de correção de homologação", () => {
    render(
      <MotivoEvento
        logs={mockHomologacaoLogs}
        titulo="Motivo do teste"
        motivo="CODAE homologou"
      />
    );
    expect(
      screen.getByText("Motivo do teste (Data: 29/12/2024):")
    ).toBeInTheDocument();
  });
});
