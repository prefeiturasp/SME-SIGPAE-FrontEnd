import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import Filtros from "../index";

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe("Filtros - Nome do Produto", () => {
  it('digita "MAMAO PAPAYA", consulta e limpa filtros', async () => {
    const setFiltros = jest.fn();
    const setCronogramas = jest.fn();
    const setTotal = jest.fn();
    const store = mockStore({});

    render(
      <Provider store={store}>
        <Filtros
          setFiltros={setFiltros}
          setCronogramas={setCronogramas}
          setTotal={setTotal}
          armazens={[]}
        />
      </Provider>
    );

    const input = screen.getByTestId("nome_produto");
    fireEvent.change(input, { target: { value: "MAMAO PAPAYA" } });

    fireEvent.submit(input.closest("form"));

    expect(setFiltros).toHaveBeenCalledWith(
      expect.objectContaining({
        nome_produto: "MAMAO PAPAYA",
      })
    );

    fireEvent.click(screen.getByRole("button", { name: /limpar/i }));

    expect(setCronogramas).toHaveBeenCalledWith(undefined);
    expect(setTotal).toHaveBeenCalledWith(undefined);
  });
});
