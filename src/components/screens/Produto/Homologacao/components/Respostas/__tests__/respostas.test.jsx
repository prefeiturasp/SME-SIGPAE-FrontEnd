import { render, screen } from "@testing-library/react";
import Respostas from "..";
import { mockHomologacao } from "src/mocks/Produto/Homologacao/mockHomologacao";

describe("Teste de componente retorno de repostas da homologação", () => {
  it("deve renderizar o componente", () => {
    render(
      <Respostas homologacao={mockHomologacao} logAnaliseSensorial={[]} />
    );
    expect(
      screen.getByText("Motivo da suspensão (Data: 10/08/2023)")
    ).toBeInTheDocument();
  });
});
