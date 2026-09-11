import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import mock from "src/services/_mock";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockPedidosDREInversaoCardapio } from "src/mocks/services/inversaoDeDiaDeCardapio.service/DRE/pedidoDREInversaoDeCardapio";
import PainelPedidosInversaoCardapioDREPage from "src/pages/DRE/InversaoDiaCardapio/PainelPedidosPage.jsx";
import { mockLotesSimples } from "src/mocks/lote.service/mockLotesSimples";
import { mockMeusDadosCogestor } from "src/mocks/meusDados/cogestor";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { getDREPedidosDeInversoes } from "src/services/inversaoDeDiaDeCardapio.service";

jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  ...jest.requireActual("src/components/Shareable/Toast/dialogs"),
  toastError: jest.fn(),
}));

jest.mock("src/services/inversaoDeDiaDeCardapio.service", () => ({
  ...jest.requireActual("src/services/inversaoDeDiaDeCardapio.service"),
  getDREPedidosDeInversoes: jest.fn(),
}));

describe("Teste Página do Painel Pedidos - DRE - Inversão de dia de Cardápio", () => {
  beforeEach(async () => {
    jest.clearAllMocks();

    getDREPedidosDeInversoes.mockResolvedValue({
      results: mockPedidosDREInversaoCardapio.results,
    });
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCogestor);
    mock.onGet("/lotes-simples/").reply(200, mockLotesSimples);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.DIRETORIA_REGIONAL);
    localStorage.setItem("perfil", PERFIL.COGESTOR_DRE);

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <PainelPedidosInversaoCardapioDREPage />
        </MemoryRouter>,
      );
    });
  });

  it("renderiza blocos de solicitações vencendo, limite e regular", async () => {
    expect(
      screen.getByText(
        "Solicitações próximas ao prazo de vencimento (2 dias ou menos)",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Solicitações no prazo limite"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Solicitações no prazo regular"),
    ).toBeInTheDocument();
  });

  it("deve exibir os cards de pedidos após carregamento", async () => {
    await waitFor(() => {
      expect(screen.getByTestId("prioritario")).toBeInTheDocument();
      expect(screen.getByTestId("limite")).toBeInTheDocument();
      expect(screen.getByTestId("regular")).toBeInTheDocument();
    });
  });

  it("busca por lote", async () => {
    await act(async () => {
      fireEvent.mouseDown(
        screen
          .getByTestId("select-lote")
          .querySelector(".ant-select-selection-search-input"),
      );
    });

    await waitFor(() => screen.getByText("BT - 1"));
    await act(async () => {
      fireEvent.click(screen.getByText("BT - 1"));
    });
  });

  it("exibe erro ao carregar inversões quando o retorno possui status 400", async () => {
    await waitFor(() => {
      expect(screen.getByTestId("prioritario")).toBeInTheDocument();
    });

    getDREPedidosDeInversoes.mockResolvedValueOnce({
      status: 400,
      data: {
        detail: "Erro retornado pelo backend",
      },
      results: [],
    });

    await act(async () => {
      fireEvent.mouseDown(
        screen
          .getByTestId("select-lote")
          .querySelector(".ant-select-selection-search-input"),
      );
    });

    const opcaoLote = await screen.findByText("BT - 1");

    await act(async () => {
      fireEvent.click(opcaoLote);
    });

    await waitFor(() => {
      expect(toastError).toHaveBeenCalled();
    });
  });

  it("filtra opções de lote pelo texto digitado", async () => {
    const selectLote = screen
      .getByTestId("select-lote")
      .querySelector(".ant-select-selection-search-input");

    await act(async () => {
      fireEvent.mouseDown(selectLote);
      fireEvent.change(selectLote, {
        target: { value: "BT" },
      });
    });

    await waitFor(() => {
      expect(screen.getByText("BT - 1")).toBeInTheDocument();
    });
  });
});
