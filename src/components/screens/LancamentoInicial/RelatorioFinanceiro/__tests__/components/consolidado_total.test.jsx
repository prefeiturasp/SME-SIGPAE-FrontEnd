import { render, screen } from "@testing-library/react";
import { ConsolidadoTotal } from "../../components/ConsolidadoTotal";

describe("Teste de comportamentos componente - ConsolidadoTotal", () => {
  it("renderiza corretamente os consolidado totais a partir de cards", () => {
    const cards = [
      {
        titulo: "CONSOLIDADO CEI (A + B + C)",
        quantidade: 1000,
        valor: 7000,
      },
      {
        titulo: "CONSOLIDADO INFANTIL - EMEI (INF. A + INF. B + INF. C)",
        quantidade: 450,
        valor: 3150,
      },
      {
        titulo: "CONSOLIDADO TOTAL (A + B + C + INF. A + INF. B + INF. C)",
        quantidade: 1450,
        valor: 10150,
      },
    ];

    render(
      <>
        {cards.map((card, index) => (
          <div className="mt-4" key={index}>
            <ConsolidadoTotal
              titulo={card.titulo}
              quantidade={card.quantidade}
              valor={card.valor}
            />
          </div>
        ))}
      </>,
    );

    expect(screen.getByText("CONSOLIDADO CEI (A + B + C)")).toBeInTheDocument();

    expect(
      screen.getByText(
        "CONSOLIDADO INFANTIL - EMEI (INF. A + INF. B + INF. C)",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "CONSOLIDADO TOTAL (A + B + C + INF. A + INF. B + INF. C)",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getAllByText("QUANTIDADE SERVIDA (A + B + C):")[0],
    ).toBeInTheDocument();

    expect(
      screen.getAllByText("VALOR DO FATURAMENTO TOTAL (A + B + C):")[0],
    ).toBeInTheDocument();

    expect(
      screen.getByText((_, element) => element?.textContent === "1.000"),
    ).toBeInTheDocument();

    expect(
      screen.getByText((_, element) => element?.textContent === "450"),
    ).toBeInTheDocument();

    expect(
      screen.getByText((_, element) => element?.textContent === "1.450"),
    ).toBeInTheDocument();

    expect(
      screen.getByText((_, element) => element?.textContent === "R$ 7.000,00"),
    ).toBeInTheDocument();

    expect(
      screen.getByText((_, element) => element?.textContent === "R$ 3.150,00"),
    ).toBeInTheDocument();

    expect(
      screen.getByText((_, element) => element?.textContent === "R$ 10.150,00"),
    ).toBeInTheDocument();
  });
});
