import { render, screen } from "@testing-library/react";
import { mockHomologacaoLogs } from "../../../../mocks/Produto/Homologacao/mockHomologacaoLogs";
import MotivoEvento from "src/components/Shareable/MotivoEvento";

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
      screen.getByText("Motivo do teste (Data: 27/12/2023):")
    ).toBeInTheDocument();
  });
});
