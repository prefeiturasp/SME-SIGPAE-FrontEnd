import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import { MemoryRouter } from "react-router-dom";
import Filtros from "src/components/screens/PreRecebimento/SolicitacaoAlteracaoCronograma/components/Filtros";

jest.mock("src/components/Shareable/DatePicker", () => ({
  InputComData: ({ input, placeholder }) => (
    <input
      data-testid={placeholder}
      placeholder={placeholder}
      value={input.value}
      onChange={(e) => input.onChange(e.target.value)}
    />
  ),
}));

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe("Filtros - Solicitação Alteração Cronograma", () => {
  let store;
  let setFiltros;
  let setAlteracoesCronogramas;
  let setTotal;

  beforeEach(() => {
    store = mockStore({});
    setFiltros = jest.fn();
    setAlteracoesCronogramas = jest.fn();
    setTotal = jest.fn();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Filtros
            setFiltros={setFiltros}
            setAlteracoesCronogramas={setAlteracoesCronogramas}
            setTotal={setTotal}
            fornecedor={false}
          />
        </MemoryRouter>
      </Provider>
    );
  });

  it('preenche "De" e "Até" com 13/06/2025, consulta e limpa filtros', async () => {
    const inputDe = screen.getByTestId("De");
    fireEvent.change(inputDe, { target: { value: "13/06/2025" } });

    const inputAte = screen.getByTestId("Até");
    fireEvent.change(inputAte, { target: { value: "13/06/2025" } });

    const btnFiltrar = screen.getByRole("button", { name: /filtrar/i });
    fireEvent.click(btnFiltrar);

    await waitFor(() => {
      expect(setFiltros).toHaveBeenCalledWith(
        expect.objectContaining({
          data_after: "13/06/2025",
          data_before: "13/06/2025",
        })
      );
    });

    fireEvent.change(inputDe, { target: { value: "13/06/2025" } });
    fireEvent.change(inputAte, { target: { value: "13/06/2025" } });

    const btnLimpar = screen.getByRole("button", { name: /limpar filtros/i });
    fireEvent.click(btnLimpar);

    await waitFor(() => {
      expect(setAlteracoesCronogramas).toHaveBeenCalledWith(undefined);
      expect(setTotal).toHaveBeenCalledWith(undefined);
    });
  });

  it('digita "204/2025A" no N° do Cronograma, consulta e limpa filtros', async () => {
    const input = screen.getByPlaceholderText("Digite o n° do Cronograma");
    fireEvent.change(input, { target: { value: "204/2025A" } });

    const btnFiltrar = screen.getByRole("button", { name: /filtrar/i });
    fireEvent.click(btnFiltrar);

    await waitFor(() => {
      expect(setFiltros).toHaveBeenCalledWith(
        expect.objectContaining({
          numero_cronograma: "204/2025A",
        })
      );
    });

    fireEvent.change(input, { target: { value: "204/2025A" } });

    const btnLimpar = screen.getByRole("button", { name: /limpar filtros/i });
    fireEvent.click(btnLimpar);

    await waitFor(() => {
      expect(setAlteracoesCronogramas).toHaveBeenCalledWith(undefined);
      expect(setTotal).toHaveBeenCalledWith(undefined);
    });
  });
});
