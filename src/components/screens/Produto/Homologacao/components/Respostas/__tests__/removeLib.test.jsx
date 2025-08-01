import { render, screen } from "@testing-library/react";
import MotivoCancelamento from "../MotivoCancelamento";
import { mockHomologacaoLogs } from "../../../../../../../mocks/Produto/Homologacao/mockHomologacaoLogs";

describe("Teste de componente após remoção de biblioteca 'ramda'.", () => {
  it("deve renderizar o componente de cancelamento homologação", () => {
    render(<MotivoCancelamento logs={mockHomologacaoLogs} />);
    expect(
      screen.getByText(/motivo do cancelamento da homologação/i)
    ).toBeInTheDocument();
  });
});
