import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { legacy_createStore as createStore } from "redux";

import CardHistorico from "../components/CardHistorico";

jest.mock("react-collapse", () => ({
  Collapse: ({ isOpened, children }) =>
    isOpened ? <div>{children}</div> : null,
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  Navigate: ({ to }) => <div data-testid="navigate">{to}</div>,
}));

const reducer = (
  state = {
    form: {
      cardHistoricoForm: {
        values: {
          selecionar_todos: false,
        },
      },
    },
  },
) => state;

const store = createStore(reducer);

describe("Teste de comportamentos componente Solicitação de Kit Lanche - CardHistorico", () => {
  const mockHandleSubmit = jest.fn();

  const pedidos = [
    {
      uuid: "uuid-1",
      id_externo: "PED001",
      checked: false,
      escola: {
        nome: "Escola Teste",
      },
      solicitacao_kit_lanche: {
        data: "01/01/2026",
      },
    },
  ];

  const defaultProps = {
    titulo: "Histórico",
    ultimaColunaLabel: "Data",
    pedidos,
    handleSubmit: mockHandleSubmit,
  };

  const setup = async (props = {}) => {
    await act(async () => {
      render(
        <Provider store={store}>
          <CardHistorico {...defaultProps} {...props} />
        </Provider>,
      );
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar o título", async () => {
    await setup();

    expect(screen.getByText("Histórico")).toBeInTheDocument();
  });

  it("deve expandir o card", async () => {
    await setup();

    fireEvent.click(screen.getByTestId("botao-expandir"));

    expect(screen.getByText("Selecionar todos")).toBeInTheDocument();
    expect(screen.getByText("PED001")).toBeInTheDocument();
  });

  it("deve selecionar todos", async () => {
    await setup();

    fireEvent.click(screen.getByTestId("botao-expandir"));

    fireEvent.click(screen.getByText("Selecionar todos"));

    expect(screen.getAllByRole("checkbox")).toHaveLength(2);
  });

  it("deve marcar um pedido", async () => {
    await setup();

    fireEvent.click(screen.getByTestId("botao-expandir"));

    const checkbox = screen.getAllByRole("checkbox")[1];

    fireEvent.click(checkbox);

    expect(checkbox).toBeInTheDocument();
  });

  it("deve redirecionar ao clicar no pedido", async () => {
    await setup();

    fireEvent.click(screen.getByTestId("botao-expandir"));

    fireEvent.click(screen.getByText("PED001"));

    expect(screen.getByTestId("navigate")).toHaveTextContent(
      "/solicitacao-de-kit-lanche/relatorio?uuid=uuid-1",
    );
  });

  it("deve renderizar tabela com os dados", async () => {
    await setup();

    fireEvent.click(screen.getByTestId("botao-expandir"));

    expect(screen.getByText("Escola Teste")).toBeInTheDocument();
    expect(screen.getByText("01/01/2026")).toBeInTheDocument();
  });

  it("não deve renderizar linhas quando não houver pedidos", async () => {
    await setup({
      pedidos: [],
    });

    fireEvent.click(screen.getByTestId("botao-expandir"));

    expect(screen.queryByText("PED001")).not.toBeInTheDocument();
    expect(screen.queryByText("Escola Teste")).not.toBeInTheDocument();
  });
});
