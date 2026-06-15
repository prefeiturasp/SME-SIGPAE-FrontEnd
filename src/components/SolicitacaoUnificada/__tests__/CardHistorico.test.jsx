import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import { CardHistorico } from "src/components/SolicitacaoUnificada/components/CardHistorico";
import {
  RELATORIO,
  SOLICITACAO_KIT_LANCHE_UNIFICADA,
} from "src/configs/constants";

jest.mock("react-redux", () => {
  const React = require("react");

  return {
    connect: (mapStateToProps) => (Component) => {
      const ConnectedComponent = (props) => {
        const mappedProps = mapStateToProps({ form: {} });

        return React.createElement(Component, {
          ...mappedProps,
          ...props,
        });
      };

      return ConnectedComponent;
    },
  };
});

jest.mock("redux-form", () => ({
  Field: ({ component: Component = "input", type, name }) => (
    <Component type={type} name={name} data-testid={name} />
  ),
  reduxForm: () => (Component) => Component,
  formValueSelector: () => () => false,
}));

jest.mock("react-collapse", () => ({
  Collapse: ({ isOpened, children }) =>
    isOpened ? <div data-testid="collapse-open">{children}</div> : null,
}));

jest.mock("react-router-dom", () => ({
  Navigate: ({ to }) => <div data-testid="navigate" data-to={to} />,
}));

jest.mock("src/components/Shareable/ToggleExpandir", () => ({
  ToggleExpandir: ({ onClick, ativo }) => (
    <button type="button" data-testid="toggle-expandir" onClick={onClick}>
      {ativo ? "Recolher" : "Expandir"}
    </button>
  ),
}));

jest.mock("src/components/Shareable/Botao", () => ({
  __esModule: true,
  default: ({ titulo, type, className }) => (
    <button type={type} className={className}>
      {titulo}
    </button>
  ),
}));

jest.mock("src/components/Shareable/Botao/constants", () => ({
  BUTTON_ICON: {
    PRINT: "print",
  },
  BUTTON_STYLE: {
    BLUE: "blue",
  },
  BUTTON_TYPE: {
    BUTTON: "button",
  },
}));

const pedidosMock = [
  {
    uuid: "f79bb7f6-3e6f-4d07-b5f8-0e8bbd8d347a",
    id_externo: "PEDIDO-001",
    lote: "Lote 1",
    checked: false,
    diretoria_regional: {
      nome: "DRE Butantã",
    },
    solicitacao_kit_lanche: {
      data: "10/06/2026",
    },
  },
  {
    uuid: "4f41d4b2-616f-4cb5-a4e3-3cdb97a4e6c8",
    id_externo: "PEDIDO-002",
    lote: "Lote 2",
    checked: false,
    diretoria_regional: {
      nome: "DRE Campo Limpo",
    },
    solicitacao_kit_lanche: {
      data: "11/06/2026",
    },
  },
];

const renderComponent = (props = {}) => {
  const defaultProps = {
    titulo: "Histórico de solicitações",
    ultimaColunaLabel: "Data da solicitação",
    pedidos: pedidosMock.map((pedido) => ({ ...pedido })),
    selecionar_todos: false,
    change: jest.fn(),
    handleSubmit: jest.fn(),
  };

  const mergedProps = {
    ...defaultProps,
    ...props,
  };

  const renderResult = render(<CardHistorico {...mergedProps} />);

  return {
    ...renderResult,
    props: mergedProps,
  };
};

const expandCard = async () => {
  fireEvent.click(screen.getByTestId("toggle-expandir"));

  await waitFor(() => {
    expect(screen.getByTestId("collapse-open")).toBeInTheDocument();
  });
};

describe("CardHistorico - Solicitação Unificada", () => {
  it("renderiza o card fechado com o título informado", () => {
    renderComponent();

    expect(screen.getByText("Histórico de solicitações")).toBeInTheDocument();
    expect(screen.getByTestId("toggle-expandir")).toHaveTextContent("Expandir");
    expect(screen.queryByTestId("collapse-open")).not.toBeInTheDocument();
  });

  it("expande o card e exibe cabeçalhos, botão de impressão e pedidos", async () => {
    renderComponent();

    await expandCard();

    expect(screen.getByText("Código do Pedido")).toBeInTheDocument();
    expect(screen.getByText("Lote")).toBeInTheDocument();
    expect(screen.getByText("DRE")).toBeInTheDocument();
    expect(screen.getByText("Data da solicitação")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "imprimir" }),
    ).toBeInTheDocument();

    expect(screen.getByText("PEDIDO-001")).toBeInTheDocument();
    expect(screen.getByText("Lote 1")).toBeInTheDocument();
    expect(screen.getByText("DRE Butantã")).toBeInTheDocument();
    expect(screen.getByText("10/06/2026")).toBeInTheDocument();

    expect(screen.getByText("PEDIDO-002")).toBeInTheDocument();
    expect(screen.getByText("Lote 2")).toBeInTheDocument();
    expect(screen.getByText("DRE Campo Limpo")).toBeInTheDocument();
    expect(screen.getByText("11/06/2026")).toBeInTheDocument();
  });

  it("usa Data como label padrão da última coluna quando ultimaColunaLabel não é informado", async () => {
    renderComponent({
      ultimaColunaLabel: undefined,
    });

    await expandCard();

    expect(screen.getByText("Data")).toBeInTheDocument();
  });

  it("marca todos os pedidos ao clicar em Selecionar todos", async () => {
    const { container, props } = renderComponent();

    await expandCard();

    const selecionarTodosButton = container.querySelector(
      ".select-all .checkbox-custom",
    );

    fireEvent.click(selecionarTodosButton);

    expect(props.change).toHaveBeenCalledWith("check_0", true);
    expect(props.change).toHaveBeenCalledWith("check_1", true);
    expect(props.change).toHaveBeenCalledWith("selecionar_todos", true);
  });

  it("desmarca todos os pedidos quando selecionar_todos já está marcado", async () => {
    const { container, props } = renderComponent({
      selecionar_todos: true,
    });

    await expandCard();

    const selecionarTodosButton = container.querySelector(
      ".select-all .checkbox-custom",
    );

    fireEvent.click(selecionarTodosButton);

    expect(props.change).toHaveBeenCalledWith("check_0", false);
    expect(props.change).toHaveBeenCalledWith("check_1", false);
    expect(props.change).toHaveBeenCalledWith("selecionar_todos", false);
  });

  it("alterna a seleção individual de um pedido", async () => {
    const { container, props } = renderComponent();

    await expandCard();

    const checkboxPedido = container.querySelector(
      "tbody .checkbox-custom.report-line",
    );

    fireEvent.click(checkboxPedido);

    expect(props.change).toHaveBeenCalledWith("check_0", true);
  });

  it("redireciona para o relatório ao clicar no código do pedido", async () => {
    const pedido = pedidosMock[0];

    renderComponent({
      pedidos: [{ ...pedido }],
    });

    await expandCard();

    fireEvent.click(screen.getByText("PEDIDO-001"));

    const expectedUrl = `/${SOLICITACAO_KIT_LANCHE_UNIFICADA}/${RELATORIO}?uuid=${pedido.uuid}`;

    expect(screen.getByTestId("navigate")).toHaveAttribute(
      "data-to",
      expectedUrl,
    );
  });

  it("redireciona para o relatório ao clicar no lote do pedido", async () => {
    const pedido = pedidosMock[0];

    renderComponent({
      pedidos: [{ ...pedido }],
    });

    await expandCard();

    fireEvent.click(screen.getByText("Lote 1"));

    const expectedUrl = `/${SOLICITACAO_KIT_LANCHE_UNIFICADA}/${RELATORIO}?uuid=${pedido.uuid}`;

    expect(screen.getByTestId("navigate")).toHaveAttribute(
      "data-to",
      expectedUrl,
    );
  });

  it("redireciona para o relatório ao clicar na DRE do pedido", async () => {
    const pedido = pedidosMock[0];

    renderComponent({
      pedidos: [{ ...pedido }],
    });

    await expandCard();

    fireEvent.click(screen.getByText("DRE Butantã"));

    const expectedUrl = `/${SOLICITACAO_KIT_LANCHE_UNIFICADA}/${RELATORIO}?uuid=${pedido.uuid}`;

    expect(screen.getByTestId("navigate")).toHaveAttribute(
      "data-to",
      expectedUrl,
    );
  });
});
