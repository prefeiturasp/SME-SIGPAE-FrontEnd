import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import Filtros from "src/components/screens/Logistica/ConsultaSolicitacaoAlteracao/components/Filtros";

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const store = mockStore({});

describe("Filtros - Fluxo Completo", () => {
  it("testa todos os campos de filtro, consulta e limpa filtros", async () => {
    const mockSetFiltros = jest.fn();
    const mockSetSolicitacoes = jest.fn();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Filtros
            setFiltros={mockSetFiltros}
            setSolicitacoes={mockSetSolicitacoes}
            numeroSolicitacaoInicial=""
            inicioResultado={React.createRef()}
          />
        </MemoryRouter>
      </Provider>
    );

    const inputRequisicao = screen.getByPlaceholderText(
      "Digite o Nº da Requisição"
    );
    fireEvent.change(inputRequisicao, { target: { value: "27510" } });
    fireEvent.click(screen.getByRole("button", { name: /consultar/i }));
    await waitFor(() => {
      expect(mockSetFiltros).toHaveBeenCalledWith(
        expect.objectContaining({ numero_requisicao: "27510" })
      );
    });
    fireEvent.change(inputRequisicao, { target: { value: "27510" } });
    fireEvent.click(screen.getByRole("button", { name: /limpar filtros/i }));
    await waitFor(() => {
      expect(mockSetSolicitacoes).toHaveBeenCalledWith(undefined);
    });

    fireEvent.change(screen.getByPlaceholderText("De"), {
      target: { value: "04/05/2023" },
    });
    fireEvent.change(screen.getByPlaceholderText("Até"), {
      target: { value: "04/05/2023" },
    });
    fireEvent.click(screen.getByRole("button", { name: /consultar/i }));
    await waitFor(() => {
      expect(mockSetFiltros).toHaveBeenCalledWith(
        expect.objectContaining({
          data_inicial: "04/05/2023",
          data_final: "04/05/2023",
        })
      );
    });
    fireEvent.change(screen.getByPlaceholderText("De"), {
      target: { value: "04/05/2023" },
    });
    fireEvent.change(screen.getByPlaceholderText("Até"), {
      target: { value: "04/05/2023" },
    });
    fireEvent.click(screen.getByRole("button", { name: /limpar filtros/i }));
    await waitFor(() => {
      expect(mockSetSolicitacoes).toHaveBeenCalledWith(undefined);
    });

    const inputSolicitacao = screen.getByPlaceholderText(
      "Digite o Nº da Solicitação"
    );
    fireEvent.change(inputSolicitacao, { target: { value: "00000108-ALT" } });
    fireEvent.click(screen.getByRole("button", { name: /consultar/i }));
    await waitFor(() => {
      expect(mockSetFiltros).toHaveBeenCalledWith(
        expect.objectContaining({ numero_solicitacao: "00000108-ALT" })
      );
    });
    fireEvent.change(inputSolicitacao, { target: { value: "00000108-ALT" } });
    fireEvent.click(screen.getByRole("button", { name: /limpar filtros/i }));
    await waitFor(() => {
      expect(mockSetSolicitacoes).toHaveBeenCalledWith(undefined);
    });

    const inputDistribuidor = screen.getByPlaceholderText(
      "Digite o Nome do Distribuidor"
    );
    fireEvent.change(inputDistribuidor, {
      target: { value: "Serbom Armazens Gerais Frigorificos LTDA" },
    });
    fireEvent.click(screen.getByRole("button", { name: /consultar/i }));
    await waitFor(() => {
      expect(mockSetFiltros).toHaveBeenCalledWith(
        expect.objectContaining({
          nome_distribuidor: "Serbom Armazens Gerais Frigorificos LTDA",
        })
      );
    });
    fireEvent.change(inputDistribuidor, {
      target: { value: "Serbom Armazens Gerais Frigorificos LTDA" },
    });
    fireEvent.click(screen.getByRole("button", { name: /limpar filtros/i }));
    await waitFor(() => {
      expect(mockSetSolicitacoes).toHaveBeenCalledWith(undefined);
    });
  });
});
