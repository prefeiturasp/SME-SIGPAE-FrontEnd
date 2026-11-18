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

  const resumoDescontos = (dados) => ({
    tituloFaixaOuAlimentacao: "ALIMENTAÇÃO",
    linhas: [{ chave: "uuid-1" }],
    total: 121.25,
    ...dados,
  });

  it("não exibe o bloco de descontos sem descontos aplicados", () => {
    const props = {
      titulo: "CONSOLIDADO TOTAL (A + B + C)",
      quantidade: 1000,
      valor: 7000,
    };
    const { container: semProp } = render(<ConsolidadoTotal {...props} />);
    const { container: semLinhas } = render(
      <ConsolidadoTotal
        {...props}
        descontos={resumoDescontos({ linhas: [], total: 0 })}
      />,
    );

    expect(semLinhas.innerHTML).toBe(semProp.innerHTML);
    expect(semProp.querySelector(".com-descontos")).toBeNull();
    expect(screen.queryByText("DESCONTOS TOTAIS (D)")).not.toBeInTheDocument();
    expect(
      screen.queryByText("CONFORME ITENS NAS TABELAS"),
    ).not.toBeInTheDocument();
  });

  it("exibe os descontos totais e o valor do faturamento final", () => {
    render(
      <ConsolidadoTotal
        titulo="CONSOLIDADO TOTAL (A + B + C + INF. A + INF. B + INF. C)"
        tituloQuantidade="QUANTIDADE SERVIDA:"
        quantidade={1450}
        tituloValor="VALOR DO FATURAMENTO TOTAL:"
        valor={565203.82}
        descontos={resumoDescontos()}
      />,
    );

    expect(screen.getByText("DESCONTOS TOTAIS (D)")).toBeInTheDocument();
    expect(screen.getByText("R$ 121,25")).toBeInTheDocument();
    expect(screen.getByText("CONFORME ITENS NAS TABELAS")).toBeInTheDocument();
    expect(
      screen.getByText(
        "VALOR DO FATURAMENTO FINAL (A + B + C + INF. A + INF. B + INF. C - D):",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("R$ 565.082,57")).toBeInTheDocument();
    expect(
      screen.getByText(
        "(Quinhentos e sessenta e cinco mil e oitenta e dois reais e cinquenta e sete centavos.)",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("R$ 565.203,82")).toBeInTheDocument();
  });
});
