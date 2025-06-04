import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import CardHistorico from "../../CardHistorico/CardHistorico";

afterEach(cleanup);

const renderWithReduxForm = (component, initialState = {}) => {
  const rootReducer = combineReducers({ form: formReducer });
  const store = createStore(rootReducer, initialState);
  return render(<Provider store={store}>{component}</Provider>);
};

describe("CardHistorico component", () => {
  test("Renderiza título e pedidos corretamente", () => {
    const mockPedidos = [
      {
        uuid: "uuid-1",
        id_externo: "123",
        escola: { nome: "Escola A" },
        data_inicial: "2023-01-01",
      },
      {
        uuid: "uuid-2",
        id_externo: "456",
        escola: { nome: "Escola B" },
        data_inicial: "2023-01-02",
      },
    ];

    renderWithReduxForm(
      <CardHistorico
        titulo="Histórico de Solicitações"
        pedidos={mockPedidos}
        change={jest.fn()}
        handleSubmit={jest.fn()}
        selecionar_todos={false}
      />
    );

    expect(screen.getByText("Histórico de Solicitações")).toBeInTheDocument();

    expect(screen.getByText("Escola A")).toBeInTheDocument();
    expect(screen.getByText("Escola B")).toBeInTheDocument();
    expect(screen.getByText("123")).toBeInTheDocument();
    expect(screen.getByText("456")).toBeInTheDocument();
  });

  test("Expande e mostra o conteúdo ao clicar no toggle", () => {
    const mockPedidos = [];

    const { container } = renderWithReduxForm(
      <CardHistorico
        titulo="Histórico"
        pedidos={mockPedidos}
        change={jest.fn()}
        handleSubmit={jest.fn()}
        selecionar_todos={false}
      />
    );

    const toggleIcon = container.querySelector(".toggle-expandir, .ps-5 div");
    expect(toggleIcon).toBeTruthy();
    fireEvent.click(toggleIcon);

    expect(container.querySelector(".card-body")).toBeInTheDocument();
  });
});
