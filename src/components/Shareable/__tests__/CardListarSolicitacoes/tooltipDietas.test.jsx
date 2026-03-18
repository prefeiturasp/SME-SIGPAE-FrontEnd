import React from "react";
import { render, screen } from "@testing-library/react";
import TooltipVisualizacoesSimultaneas from "../../CardListarSolicitacoes/tooltipoDietas";

jest.mock("antd", () => ({
  Tooltip: ({ children }) => <div data-testid="tooltip-dieta">{children}</div>,
}));

describe("TooltipVisualizacoesSimultaneas", () => {
  it("não renderiza quando quantidade é 0", () => {
    const { container } = render(
      <TooltipVisualizacoesSimultaneas quantidade={0} />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("renderiza tooltip quando quantidade > 0", () => {
    render(<TooltipVisualizacoesSimultaneas quantidade={1} />);

    expect(screen.getByTestId("tooltip-dieta")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("aplica classe dietas-abertas", () => {
    render(<TooltipVisualizacoesSimultaneas quantidade={3} />);

    const element = screen.getByText("3");

    expect(element).toHaveClass("dietas-abertas");
  });

  it("aplica classe qtd-dois-digitos quando quantidade > 9", () => {
    render(<TooltipVisualizacoesSimultaneas quantidade={10} />);

    const element = screen.getByText("10");

    expect(element).toHaveClass("qtd-dois-digitos");
  });
});
