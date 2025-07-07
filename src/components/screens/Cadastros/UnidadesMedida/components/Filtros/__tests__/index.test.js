import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import Filtros from "../index";

jest.mock("src/components/Shareable/DatePicker", () => ({
  InputComData: ({ input, ...props }) => (
    <input data-testid="input-data-cadastro" {...input} {...props} />
  ),
}));

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe("Filtros - Unidades de Medida", () => {
  let store;
  let setFiltros;
  let setUnidadesMedida;
  let setTotal;

  beforeEach(() => {
    store = mockStore({});
    setFiltros = jest.fn();
    setUnidadesMedida = jest.fn();
    setTotal = jest.fn();

    render(
      <MemoryRouter>
        <Provider store={store}>
          <Filtros
            setFiltros={setFiltros}
            setUnidadesMedida={setUnidadesMedida}
            setTotal={setTotal}
            nomesUnidadesMedida={["DECIGRAMA", "GRAMAS"]}
            abreviacoesUnidadesMedida={["dg", "g"]}
          />
        </Provider>
      </MemoryRouter>
    );
  });

  it('digita "DECIGRAMA" no nome, consulta e limpa filtros', () => {
    const inputNome = screen.getAllByRole("combobox")[0];
    fireEvent.change(inputNome, { target: { value: "DECIGRAMA" } });

    const botaoFiltrar = screen.getByRole("button", { name: /filtrar/i });
    fireEvent.click(botaoFiltrar);

    expect(setFiltros).toHaveBeenCalledWith(
      expect.objectContaining({ nome: "DECIGRAMA" })
    );

    const botaoLimpar = screen.getByRole("button", { name: /limpar/i });
    fireEvent.click(botaoLimpar);

    expect(setUnidadesMedida).toHaveBeenCalledWith(undefined);
    expect(setTotal).toHaveBeenCalledWith(undefined);
  });

  it('digita "dg" na abreviação, consulta e limpa filtros', () => {
    const inputAbreviacao = screen.getAllByRole("combobox")[1];
    fireEvent.change(inputAbreviacao, { target: { value: "dg" } });

    const botaoFiltrar = screen.getByRole("button", { name: /filtrar/i });
    fireEvent.click(botaoFiltrar);

    expect(setFiltros).toHaveBeenCalledWith(
      expect.objectContaining({ abreviacao: "dg" })
    );

    const botaoLimpar = screen.getByRole("button", { name: /limpar/i });
    fireEvent.click(botaoLimpar);

    expect(setUnidadesMedida).toHaveBeenCalledWith(undefined);
    expect(setTotal).toHaveBeenCalledWith(undefined);
  });

  it('digita "18/01/2024" na data, consulta e limpa filtros', () => {
    const inputData = screen.getByTestId("input-data-cadastro");
    fireEvent.change(inputData, { target: { value: "18/01/2024" } });

    const botaoFiltrar = screen.getByRole("button", { name: /filtrar/i });
    fireEvent.click(botaoFiltrar);

    expect(setFiltros).toHaveBeenCalledWith(
      expect.objectContaining({ data_cadastro: "18/01/2024" })
    );

    const botaoLimpar = screen.getByRole("button", { name: /limpar/i });
    fireEvent.click(botaoLimpar);

    expect(setUnidadesMedida).toHaveBeenCalledWith(undefined);
    expect(setTotal).toHaveBeenCalledWith(undefined);
  });
});
