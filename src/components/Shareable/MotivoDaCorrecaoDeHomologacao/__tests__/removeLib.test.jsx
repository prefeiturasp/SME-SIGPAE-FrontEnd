import { render, screen } from "@testing-library/react";
import { mockHomologacaoLogs } from "../../../../mocks/Produto/Homologacao/mockHomologacaoLogs";
import MotivoDaCorrecaoDeHomologacao from "src/components/Shareable/MotivoDaCorrecaoDeHomologacao";

describe("Teste de componente após remoção de biblioteca 'ramda'.", () => {
  it("deve renderizar o componente de correção de homologação", () => {
    render(<MotivoDaCorrecaoDeHomologacao logs={mockHomologacaoLogs} />);
    expect(
      screen.getByText(/motivo da solicitação de correção do produto/i)
    ).toBeInTheDocument();
  });
});
