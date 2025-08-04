import { render, screen } from "@testing-library/react";
import MotivoRecusa from "../MotivoRecusa";
import { mockHomologacaoLogs } from "src/mocks/Produto/Homologacao/mockHomologacaoLogs";

describe("Teste de componente genérico motivo recusa", () => {
  it("deve renderizar o componente genérico", () => {
    render(
      <MotivoRecusa
        logs={mockHomologacaoLogs}
        motivo="Terceirizada cancelou solicitação de homologação de produto"
        titulo="Motivo do teste"
      />
    );
    expect(
      screen.getByText("Motivo do teste (Data: 08/01/2024)")
    ).toBeInTheDocument();
  });
});
