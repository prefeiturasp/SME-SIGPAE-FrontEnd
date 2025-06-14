import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import Filtros from "src/components/screens/Logistica/GestaoRequisicaoEntrega/components/Filtros";

jest.mock("src/services/logistica.service", () => ({
  getNomesUnidadesEscolares: jest.fn(() =>
    Promise.resolve({
      status: 200,
      data: {
        results: [{ nome_unidade: "EMEF TESTE" }],
      },
    })
  ),
}));

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const store = mockStore({});

const renderComponent = (props = {}) => {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Filtros
          setFiltros={props.setFiltros || jest.fn()}
          setSolicitacoes={props.setSolicitacoes || jest.fn()}
          setTotal={props.setTotal || jest.fn()}
          initialValues={props.initialValues || {}}
          setInitialValues={props.setInitialValues || jest.fn()}
          inicioResultado={React.createRef()}
        />
      </MemoryRouter>
    </Provider>
  );
};

describe("Filtros - Todos os campos", () => {
  it("Preenche todos os campos e clica em Consultar", async () => {
    const mockSetFiltros = jest.fn();
    const mockSetInitialValues = jest.fn();

    const { container } = renderComponent({
      setFiltros: mockSetFiltros,
      setInitialValues: mockSetInitialValues,
    });

    fireEvent.change(screen.getByPlaceholderText("Digite o Nº da Requisição"), {
      target: { value: "11011" },
    });

    fireEvent.change(screen.getByPlaceholderText("Digite o Nº da Guia"), {
      target: { value: "70559" },
    });

    fireEvent.change(screen.getByPlaceholderText("Digite o Nome do Produto"), {
      target: { value: "COXAO DURO" },
    });

    fireEvent.change(screen.getByPlaceholderText("De"), {
      target: { value: "24/12/2024" },
    });

    fireEvent.change(screen.getByPlaceholderText("Até"), {
      target: { value: "24/12/2024" },
    });

    fireEvent.change(screen.getByPlaceholderText("Digite o Código"), {
      target: { value: "7377" },
    });

    fireEvent.change(screen.getByPlaceholderText("Digite o nome da UE"), {
      target: { value: "CEI DIRET ROBERTO ARANTES LANHOSO" },
    });

    const statusSelect = container.querySelector('[data-cy="Status"]');
    fireEvent.change(statusSelect, { target: { value: "DILOG_ENVIA" } });

    fireEvent.click(screen.getByRole("button", { name: /consultar/i }));

    await waitFor(() => {
      expect(mockSetFiltros).toHaveBeenCalledWith(
        expect.objectContaining({
          numero_requisicao: "11011",
          numero_guia: "70559",
          nome_produto: "COXAO DURO",
          data_inicial: "24/12/2024",
          data_final: "24/12/2024",
          codigo_unidade: "7377",
          nome_unidade: "CEI DIRET ROBERTO ARANTES LANHOSO",
          status: "DILOG_ENVIA",
        })
      );
    });
  });

  it("Preenche todos os campos e clica em Limpar Filtros", async () => {
    const { container } = renderComponent();

    fireEvent.change(screen.getByPlaceholderText("Digite o Nº da Requisição"), {
      target: { value: "11011" },
    });

    fireEvent.change(screen.getByPlaceholderText("Digite o Nº da Guia"), {
      target: { value: "70559" },
    });

    fireEvent.change(screen.getByPlaceholderText("Digite o Nome do Produto"), {
      target: { value: "COXAO DURO" },
    });

    fireEvent.change(screen.getByPlaceholderText("De"), {
      target: { value: "24/12/2024" },
    });

    fireEvent.change(screen.getByPlaceholderText("Até"), {
      target: { value: "24/12/2024" },
    });

    fireEvent.change(screen.getByPlaceholderText("Digite o Código"), {
      target: { value: "7377" },
    });

    fireEvent.change(screen.getByPlaceholderText("Digite o nome da UE"), {
      target: { value: "CEI TESTE" },
    });

    const statusSelect = container.querySelector('[data-cy="Status"]');
    fireEvent.change(statusSelect, { target: { value: "DILOG_ENVIA" } });

    const botaoLimpar = screen.getByRole("button", { name: /limpar filtros/i });
    fireEvent.click(botaoLimpar);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Digite o Nº da Requisição").value
      ).toBe("");
      expect(screen.getByPlaceholderText("Digite o Nº da Guia").value).toBe("");
      expect(
        screen.getByPlaceholderText("Digite o Nome do Produto").value
      ).toBe("");
      expect(screen.getByPlaceholderText("De").value).toBe("");
      expect(screen.getByPlaceholderText("Até").value).toBe("");
      expect(screen.getByPlaceholderText("Digite o Código").value).toBe("");
      expect(screen.getByPlaceholderText("Digite o nome da UE").value).toBe("");
      expect(container.querySelector('[data-cy="Status"]').value).toBe("");
    });
  });
});
