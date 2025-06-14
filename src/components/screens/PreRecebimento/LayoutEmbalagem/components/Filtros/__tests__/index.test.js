import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import { MemoryRouter } from "react-router-dom";
import Filtros from "src/components/screens/PreRecebimento/LayoutEmbalagem/components/Filtros";
import * as fichaService from "src/services/fichaTecnica.service";

jest.mock("src/services/fichaTecnica.service", () => ({
  getListaFichasTecnicasSimples: jest.fn(() =>
    Promise.resolve({
      data: {
        results: [
          {
            numero: "FT079",
            produto: { nome: "ARROZ TIPO I" },
            pregao_chamada_publica: "1",
          },
        ],
      },
    })
  ),
}));

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const store = mockStore({});

describe("Filtros - Fluxo Completo", () => {
  let setFiltros;
  let setLayoutsEmbalagens;
  let setConsultaRealizada;

  beforeEach(() => {
    setFiltros = jest.fn();
    setLayoutsEmbalagens = jest.fn();
    setConsultaRealizada = jest.fn();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Filtros
            setFiltros={setFiltros}
            setLayoutsEmbalagens={setLayoutsEmbalagens}
            setConsultaRealizada={setConsultaRealizada}
          />
        </MemoryRouter>
      </Provider>
    );
  });

  it("executa todos os filtros e limpeza corretamente", async () => {
    await waitFor(() => {
      expect(fichaService.getListaFichasTecnicasSimples).toHaveBeenCalled();
    });

    const inputs = screen.getAllByRole("combobox");

    fireEvent.change(inputs[0], { target: { value: "FT079" } });
    fireEvent.blur(inputs[0]);
    fireEvent.click(screen.getByRole("button", { name: /filtrar/i }));
    await waitFor(() => {
      expect(setFiltros).toHaveBeenCalledWith(
        expect.objectContaining({
          numero_ficha_tecnica: "FT079",
        })
      );
    });
    fireEvent.click(screen.getByRole("button", { name: /limpar filtros/i }));

    fireEvent.change(inputs[1], { target: { value: "ARROZ TIPO I" } });
    fireEvent.blur(inputs[1]);
    fireEvent.click(screen.getByRole("button", { name: /filtrar/i }));
    await waitFor(() => {
      expect(setFiltros).toHaveBeenCalledWith(
        expect.objectContaining({
          nome_produto: "ARROZ TIPO I",
        })
      );
    });
    fireEvent.click(screen.getByRole("button", { name: /limpar filtros/i }));

    fireEvent.change(inputs[2], { target: { value: "1" } });
    fireEvent.blur(inputs[2]);
    fireEvent.click(screen.getByRole("button", { name: /filtrar/i }));
    await waitFor(() => {
      expect(setFiltros).toHaveBeenCalledWith(
        expect.objectContaining({
          pregao_chamada_publica: "1",
        })
      );
    });
    fireEvent.click(screen.getByRole("button", { name: /limpar filtros/i }));

    const dropdown = screen.getByText(/Selecione os Status/i);
    fireEvent.click(dropdown);
    const aprovadoOption = await screen.findByText(/Aprovado/i);
    fireEvent.click(aprovadoOption);
    fireEvent.click(screen.getByRole("button", { name: /filtrar/i }));
    await waitFor(() => {
      expect(setFiltros).toHaveBeenCalled();
    });
    fireEvent.click(screen.getByRole("button", { name: /limpar filtros/i }));

    expect(setLayoutsEmbalagens).toHaveBeenCalledWith([]);
    expect(setConsultaRealizada).toHaveBeenCalledWith(false);
    expect(setFiltros).toHaveBeenCalledWith({});
  });
});
