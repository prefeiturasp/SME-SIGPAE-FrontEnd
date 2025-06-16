import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import FiltroRequisicaoDilog from "src/components/screens/Logistica/FiltroRequisicaoDilog";
import * as logisticaService from "src/services/logistica.service";

jest.mock("src/services/logistica.service", () => ({
  getNomesDistribuidores: jest.fn(() =>
    Promise.resolve({
      data: { results: [{ nome_fantasia: "DISTRIBUIDOR TESTE" }] },
    })
  ),
  getNumerosRequisicoes: jest.fn(() =>
    Promise.resolve({
      data: { results: [{ numero_solicitacao: "27510" }] },
    })
  ),
  getRequisicoesDoFiltro: jest.fn(() =>
    Promise.resolve({
      data: {
        results: [
          {
            numero_solicitacao: "27510",
            guias: [{ id: 1 }, { id: 2 }],
          },
        ],
      },
    })
  ),
}));

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const store = mockStore({
  finalForm: { buscaRequisicoesDilog: {} },
});

describe("FiltroRequisicaoDilog - Fluxo Completo", () => {
  it("executa filtros de requisição e período de entrega e limpa filtros", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <FiltroRequisicaoDilog />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(logisticaService.getNomesDistribuidores).toHaveBeenCalled();
      expect(logisticaService.getNumerosRequisicoes).toHaveBeenCalled();
    });

    const inputsCombo = screen.getAllByRole("combobox");
    const inputRequisicao = inputsCombo[0];

    fireEvent.change(inputRequisicao, { target: { value: "27510" } });
    fireEvent.click(screen.getByRole("button", { name: /consultar/i }));
    await waitFor(() => {
      expect(logisticaService.getRequisicoesDoFiltro).toHaveBeenCalled();
    });
    fireEvent.change(inputRequisicao, { target: { value: "27510" } });
    fireEvent.click(screen.getByRole("button", { name: /limpar filtros/i }));
    expect(inputRequisicao).toHaveValue("");

    const inputDe = screen.getByPlaceholderText(/de/i);
    const inputAte = screen.getByPlaceholderText(/até/i);

    fireEvent.change(inputDe, { target: { value: "04/04/2023" } });
    fireEvent.blur(inputDe);

    fireEvent.change(inputAte, { target: { value: "04/04/2023" } });
    fireEvent.blur(inputAte);

    fireEvent.click(screen.getByRole("button", { name: /consultar/i }));
    await waitFor(() => {
      expect(logisticaService.getRequisicoesDoFiltro).toHaveBeenCalledTimes(2);
    });

    fireEvent.change(inputDe, { target: { value: "04/04/2023" } });
    fireEvent.blur(inputDe);

    fireEvent.change(inputAte, { target: { value: "04/04/2023" } });
    fireEvent.blur(inputAte);

    fireEvent.click(screen.getByRole("button", { name: /limpar filtros/i }));
    expect(inputDe).toHaveValue("");
    expect(inputAte).toHaveValue("");
  });
});
