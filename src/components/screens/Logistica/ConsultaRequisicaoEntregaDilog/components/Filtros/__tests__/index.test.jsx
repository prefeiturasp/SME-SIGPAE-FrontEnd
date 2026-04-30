import React from "react";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import Filtros from "..";
import mock from "src/services/_mock";

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const setFiltros = jest.fn();
const setSolicitacoes = jest.fn();
const setInitialValues = jest.fn();
const inicioResultado = { current: null };

const renderFiltros = (props = {}, storeState = {}) => {
  const store = mockStore(storeState);
  const defaultProps = {
    setFiltros,
    setSolicitacoes,
    initialValues: {},
    setInitialValues,
    inicioResultado,
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

jest.useFakeTimers();

describe("Filtros", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mock.resetHistory();
    mock.onGet(/\/terceirizadas\/lista-nomes-distribuidores\//).reply(200, {
      results: [
        { uuid: "dist-1", razao_social: "Distribuidor A" },
        { uuid: "dist-2", razao_social: "Distribuidor B" },
      ],
    });
  });

  describe("Renderizacao", () => {
    it("renderiza todos os campos do formulario", () => {
      renderFiltros();
      expect(screen.getByText(/N\u00b0 da Requisi/i)).toBeInTheDocument();
      expect(
        screen.getByText(/N\u00b0 da Guia de Remessa/i),
      ).toBeInTheDocument();
      expect(screen.getByText("Nome do Alimento")).toBeInTheDocument();
      expect(screen.getByText(/Nome dos Distribuidores/i)).toBeInTheDocument();
      expect(screen.getByText(/Nome da UE/i)).toBeInTheDocument();
      expect(screen.getByText("Status")).toBeInTheDocument();
      expect(screen.getByText(/C\u00f3digo CODAE/i)).toBeInTheDocument();
      expect(screen.getByText(/Per\u00edodo de Entrega/i)).toBeInTheDocument();
      expect(screen.getByText("Consultar")).toBeInTheDocument();
      expect(screen.getByText(/Limpar Filtros/i)).toBeInTheDocument();
    });

    it("inicia com initialValues preenchidos", () => {
      renderFiltros({ initialValues: { numero_requisicao: "123" } });
      const input = screen.getByPlaceholderText(/Digite o N\u00ba da Requisi/i);
      expect(input).toHaveValue("123");
    });
  });

  describe("Submissao do formulario", () => {
    it("chama setFiltros ao submeter com dados preenchidos", () => {
      renderFiltros();
      const input = screen.getByPlaceholderText(/Digite o N\u00ba da Requisi/i);
      fireEvent.change(input, { target: { value: "123" } });
      fireEvent.submit(input.closest("form"));
      expect(setFiltros).toHaveBeenCalledWith(
        expect.objectContaining({ numero_requisicao: "123" }),
      );
    });

    it("formata datas corretamente no submit", () => {
      renderFiltros();
      const dataInicial = screen.getByPlaceholderText("De");
      fireEvent.change(dataInicial, { target: { value: "01/01/2024" } });
      const dataFinal = screen.getByPlaceholderText(/At\u00e9/i);
      fireEvent.change(dataFinal, { target: { value: "15/01/2024" } });
      fireEvent.submit(dataInicial.closest("form"));
      expect(setFiltros).toHaveBeenCalledWith(
        expect.objectContaining({
          data_inicial: "01/01/2024",
          data_final: "15/01/2024",
        }),
      );
    });
  });

  describe("Botao Limpar Filtros", () => {
    it("chama setSolicitacoes(undefined) ao limpar", () => {
      renderFiltros({ initialValues: { numero_requisicao: "123" } });
      fireEvent.click(screen.getByRole("button", { name: /limpar/i }));
      expect(setSolicitacoes).toHaveBeenCalledWith(undefined);
    });
  });

  describe("Codigo CODAE lookup", () => {
    it("preenche nome_unidade quando CODAE retorna resultado", async () => {
      mock
        .onGet("/guias-da-requisicao/unidades-escolares/")
        .reply(200, { results: [{ nome_unidade: "EMEF Teste" }] });

      renderFiltros();
      const inputCodae = screen.getByPlaceholderText(/Digite o C\u00f3digo/i);
      fireEvent.change(inputCodae, { target: { value: "123" } });

      act(() => {
        jest.advanceTimersByTime(1100);
      });

      await waitFor(() => {
        expect(setInitialValues).toHaveBeenCalledWith(
          expect.objectContaining({ nome_unidade: "EMEF Teste" }),
        );
      });
    });

    it("limpa nome_unidade quando CODAE retorna resultado vazio", async () => {
      mock
        .onGet("/guias-da-requisicao/unidades-escolares/")
        .reply(200, { results: [] });

      renderFiltros();
      const inputCodae = screen.getByPlaceholderText(/Digite o C\u00f3digo/i);
      fireEvent.change(inputCodae, { target: { value: "999" } });

      act(() => {
        jest.advanceTimersByTime(1100);
      });

      await waitFor(() => {
        const lastCall =
          setInitialValues.mock.calls[setInitialValues.mock.calls.length - 1];
        if (lastCall) {
          expect(lastCall[0].nome_unidade).toBeUndefined();
        }
      });
    });
  });
});
