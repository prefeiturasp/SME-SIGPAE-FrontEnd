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
import { localStorageMock } from "mocks/localStorageMock";
import { mockPedidosDREInversaoCardapio } from "mocks/services/inversaoDeDiaDeCardapio.service/DRE/pedidoDREInversaoDeCardapio";
import PainelPedidosInversaoCardapioDREPage from "src/pages/DRE/InversaoDiaCardapio/PainelPedidosPage.jsx";
import { mockLotesSimples } from "mocks/lote.service/mockLotesSimples";
import { mockMeusDadosCogestor } from "mocks/meusDados/cogestor";

describe("Teste Página do Painel Pedidos - DRE - Inversão de dia de Cardápio", () => {
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCogestor);
    mock.onGet("/lotes-simples/").reply(200, mockLotesSimples);
    mock
      .onGet("/inversoes-dia-cardapio/pedidos-diretoria-regional/sem_filtro/")
      .reply(200, { results: mockPedidosDREInversaoCardapio.results });

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
        </MemoryRouter>
      );
    });
  });

  it("renderiza blocos de solicitações vencendo, limite e regular", async () => {
    expect(
      screen.getByText(
        "Solicitações próximas ao prazo de vencimento (2 dias ou menos)"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText("Solicitações no prazo limite")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Solicitações no prazo regular")
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
          .querySelector(".ant-select-selection-search-input")
      );
    });

    await waitFor(() => screen.getByText("BT - 1"));
    await act(async () => {
      fireEvent.click(screen.getByText("BT - 1"));
    });
  });
});
