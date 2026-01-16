import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import { MemoryRouter } from "react-router-dom";
import CardHistorico from "../../components/CardHistorico";
import "@testing-library/jest-dom";
import { mockSuspensaoAlimentacao } from "src/mocks/SuspensaoDeAlimentacao/mockSuspensaoAlimentacao";

const abrirCollapse = (container) => {
  const toggle = container.querySelector('[data-cy="botao-expandir"]');
  expect(toggle).toBeInTheDocument();
  fireEvent.click(toggle);
};

describe("Teste componente Card de Histórico - Suspensão de Alimentação", () => {
  const setup = ({
    initialState = {},
    store = createStore(
      combineReducers({
        form: formReducer,
      }),
      initialState,
    ),
  } = {}) => {
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <CardHistorico
            titulo="Histórico de Pedidos"
            ultimaColunaLabel="Data"
            pedidos={pedidosMock}
            handleSubmit={jest.fn()}
          />
        </MemoryRouter>
      </Provider>,
    );
  };

  const pedidosMock = [
    mockSuspensaoAlimentacao,
    {
      ...mockSuspensaoAlimentacao,
      uuid: "a7f2c8e1-4b6d-4f0e-9f3b-6d91b0f2e4a9",
      escola: {
        ...mockSuspensaoAlimentacao.escola,
        codigo_eol: "132233",
        nome: "CEI JOSEFA RIBEIRO DOS SANTOS",
      },
      id_externo: "35678",
    },
  ];

  it("deve renderizar o título do card", () => {
    setup();
    expect(screen.getByText("Histórico de Pedidos")).toBeInTheDocument();
  });

  it("deve expandir e exibir os pedidos ao clicar no toggle", () => {
    const { container } = setup();

    abrirCollapse(container);

    expect(screen.getByText("13222")).toBeInTheDocument();
    expect(
      screen.getByText("EMEF PERICLES EUGENIO DA SILVA RAMOS"),
    ).toBeInTheDocument();
  });

  it("deve marcar um pedido individual ao clicar no checkbox", () => {
    const { container } = setup();

    abrirCollapse(container);

    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[1]);
    expect(checkboxes[1]).toBeChecked();
  });

  it("deve selecionar todos os pedidos ao clicar em selecionar todos", () => {
    const { container } = setup();

    abrirCollapse(container);

    const botaoSelecionarTodos = container.querySelector(
      ".select-all .checkbox-custom",
    );

    fireEvent.click(botaoSelecionarTodos);

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[2]).toBeChecked();
  });

  it("deve desmarcar todos ao clicar novamente em selecionar todos", () => {
    const { container } = setup();

    abrirCollapse(container);

    const botaoSelecionarTodos = container.querySelector(
      ".select-all .checkbox-custom",
    );

    fireEvent.click(botaoSelecionarTodos);
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[0]).toBeChecked();

    fireEvent.click(botaoSelecionarTodos);
    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
    expect(checkboxes[2]).not.toBeChecked();
  });

  it("deve renderizar o Navigate ao clicar em um pedido", () => {
    const { container } = setup();

    abrirCollapse(container);

    fireEvent.click(screen.getByText("13222"));
    expect(screen.getByText("13222")).toBeInTheDocument();
  });
});

describe("Teste componente Card de Histórico Sem Pedidos - Suspensão de Alimentação", () => {
  it("não deve renderizar linhas quando não há pedidos", () => {
    const { container } = render(
      <Provider store={createStore(combineReducers({ form: formReducer }))}>
        <MemoryRouter>
          <CardHistorico
            titulo="Histórico de Pedidos"
            ultimaColunaLabel="Data"
            pedidos={[]}
            handleSubmit={jest.fn()}
          />
        </MemoryRouter>
      </Provider>,
    );

    abrirCollapse(container);

    expect(container.querySelector("tbody").children.length).toBe(0);
  });
});
