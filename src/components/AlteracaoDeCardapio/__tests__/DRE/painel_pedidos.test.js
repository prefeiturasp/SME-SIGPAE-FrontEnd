import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import mock from "services/_mock";
import { PERFIL, TIPO_PERFIL } from "constants/shared";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { localStorageMock } from "mocks/localStorageMock";
import { mockPedidosDREAlteracaoCardapio } from "mocks/services/alteracaoCardapio.service/DRE/pedidosDREAlteracaoCardapio";
import { mockPedidosDREAlteracaoCardapioCEI } from "mocks/services/alteracaoCardapio.service/DRE/pedidosDREAlteracaoCardapioCEI";
import { mockPedidosDREAlteracaoCardapioCEMEI } from "mocks/services/alteracaoCardapio.service/DRE/pedidosDREAlteracaoCardapioCEMEI";
import PainelPedidosAlteracaoCardapioDREPage from "pages/DRE/AlteracaoDeCardapio/PainelPedidosPage.jsx";
import { mockLotesSimples } from "mocks/lote.service/mockLotesSimples";
import { mockMeusDadosCogestor } from "mocks/meusDados/cogestor";

describe("Teste Página do Painel Pedidos - DRE - Alteração do Tipo de Alimentação", () => {
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCogestor);
    mock.onGet("/lotes-simples/").reply(200, mockLotesSimples);
    mock
      .onGet("alteracoes-cardapio/pedidos-diretoria-regional/sem_filtro/")
      .reply("200", { results: mockPedidosDREAlteracaoCardapio.results });

    mock
      .onGet("alteracoes-cardapio-cei/pedidos-diretoria-regional/sem_filtro/")
      .reply("200", { results: mockPedidosDREAlteracaoCardapioCEI.results });

    mock
      .onGet("alteracoes-cardapio-cemei/pedidos-diretoria-regional/sem_filtro/")
      .reply("200", { results: mockPedidosDREAlteracaoCardapioCEMEI.results });

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
          <PainelPedidosAlteracaoCardapioDREPage />
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
