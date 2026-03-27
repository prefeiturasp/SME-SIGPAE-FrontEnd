import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import Filtros from "../index";

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const renderFiltros = (props = {}, storeState = {}) => {
  const store = mockStore(storeState);
  const defaultProps = {
    setFiltros: jest.fn(),
    setCronogramas: jest.fn(),
    setTotal: jest.fn(),
    armazens: [],
    ...props,
  };

  return {
    store,
    ...render(
      <Provider store={store}>
        <Filtros {...defaultProps} />
      </Provider>,
    ),
  };
};

describe("Filtros - Nome do Produto", () => {
  it('digita "MAMAO PAPAYA", consulta e limpa filtros', async () => {
    const setFiltros = jest.fn();
    const setCronogramas = jest.fn();
    const setTotal = jest.fn();

    renderFiltros({
      setFiltros,
      setCronogramas,
      setTotal,
    });

    const input = screen.getByTestId("nome_produto");
    fireEvent.change(input, { target: { value: "MAMAO PAPAYA" } });

    fireEvent.submit(input.closest("form"));

    expect(setFiltros).toHaveBeenCalledWith(
      expect.objectContaining({
        nome_produto: "MAMAO PAPAYA",
      }),
    );

    fireEvent.click(screen.getByRole("button", { name: /limpar/i }));

    expect(setCronogramas).toHaveBeenCalledWith(undefined);
    expect(setTotal).toHaveBeenCalledWith(undefined);
  });

  it("limpa o campo de nome do produto ao clicar em Limpar Filtros", async () => {
    renderFiltros();

    const input = screen.getByTestId("nome_produto");
    fireEvent.change(input, { target: { value: "PRODUTO TESTE" } });
    expect(input).toHaveValue("PRODUTO TESTE");

    fireEvent.click(screen.getByRole("button", { name: /limpar/i }));

    await waitFor(() => {
      expect(input).toHaveValue("");
    });
  });
});

describe("Filtros - Submissão do formulário", () => {
  it("submete o formulário com filtros vazios", async () => {
    const setFiltros = jest.fn();

    renderFiltros({ setFiltros });

    const form = screen.getByTestId("nome_produto").closest("form");
    fireEvent.submit(form);

    expect(setFiltros).toHaveBeenCalled();
  });
});

describe("Filtros - Renderização", () => {
  it("renderiza todos os campos de filtro", () => {
    renderFiltros();

    expect(screen.getByTestId("nome_produto")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /filtrar/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /limpar/i })).toBeInTheDocument();
  });
});
