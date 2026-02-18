import { render, screen } from "@testing-library/react";
import { ConsolidadoTotal } from "../../components/ConsolidadoTotal";

describe("Teste de comportamentos componente - ConsolidadoTotal", () => {
  it("renderiza corretamente o consolidado total com quantidade e valor", () => {
    render(
      <ConsolidadoTotal
        titulo="CONSOLIDADO TOTAL (A + B + C)"
        quantidade="1450"
        valor="10150,00"
      />,
    );

    expect(
      screen.getByText("CONSOLIDADO TOTAL (A + B + C)"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("QUANTIDADE SERVIDA (A + B + C):"),
    ).toBeInTheDocument();

    expect(
      screen.getByText((_, element) => element?.textContent === "1.450"),
    ).toBeInTheDocument();

    expect(
      screen.getByText((_, element) => element?.textContent === "ALIMENTAÇÕES"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("VALOR DO FATURAMENTO TOTAL (A + B + C):"),
    ).toBeInTheDocument();

    expect(
      screen.getByText((_, element) => element?.textContent === "R$ 10150,00"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("(Dez mil cento e cinquenta reais.)", {
        selector: "span.extenso",
      }),
    ).toBeInTheDocument();
  });
});
