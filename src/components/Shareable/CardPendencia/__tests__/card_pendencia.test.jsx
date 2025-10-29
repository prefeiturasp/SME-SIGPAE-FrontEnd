import { render, screen, act } from "@testing-library/react";
import CardPendencia from "../CardPendencia";
import { retornaTituloCardPendencias } from "../helper";

describe("Testes componente de CardPendencia", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setup = async (props = {}) => {
    await act(async () => {
      render(
        <CardPendencia
          cardTitle="Pendências Gerais"
          totalOfOrders={props.totalOfOrders}
          priorityOrders={props.priorityOrders}
          onLimitOrders={props.onLimitOrders}
          regularOrders={props.regularOrders}
          priorityOrdersOnly={props.priorityOrdersOnly}
          loading={props.loading ?? true}
        />,
      );
    });
  };

  it("deve renderizar o título do card e exibir o loader quando loading for true", async () => {
    await setup({
      totalOfOrders: 5,
      priorityOrders: 2,
      onLimitOrders: 1,
      regularOrders: 2,
      loading: true,
    });

    expect(screen.getByText("Pendências Gerais")).toBeInTheDocument();
    expect(screen.getByAltText("ajax-loader")).toBeInTheDocument();
    expect(retornaTituloCardPendencias(5)).toBe("Solicitações");
  });

  it("deve renderizar corretamente os valores padrão quando as props forem undefined", async () => {
    await setup();

    expect(screen.getByText("0")).toBeInTheDocument();
    expect(retornaTituloCardPendencias(undefined)).toBe("Solicitações");
  });

  it("deve renderizar o layout completo quando priorityOrdersOnly for false", async () => {
    await setup({
      totalOfOrders: 10,
      priorityOrders: 3,
      onLimitOrders: 4,
      regularOrders: 3,
      priorityOrdersOnly: false,
      loading: false,
    });

    expect(
      screen.getByText("Perto do prazo de vencimento"),
    ).toBeInTheDocument();
    expect(screen.getByText("No prazo limite")).toBeInTheDocument();
    expect(screen.getByText("No prazo regular")).toBeInTheDocument();
    expect(screen.getAllByText("3")).toHaveLength(2);
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(retornaTituloCardPendencias(10)).toBe("Solicitações");
  });

  it("deve renderizar apenas o bloco de prioridade quando priorityOrdersOnly for true", async () => {
    await setup({
      totalOfOrders: 1,
      priorityOrders: 1,
      priorityOrdersOnly: true,
      loading: false,
    });

    expect(screen.getByText("Para dar ciência")).toBeInTheDocument();
    expect(screen.getAllByText("1")).toHaveLength(2);
    expect(screen.queryByText("No prazo limite")).not.toBeInTheDocument();
    expect(retornaTituloCardPendencias(1)).toBe("Solicitação");
  });
});
