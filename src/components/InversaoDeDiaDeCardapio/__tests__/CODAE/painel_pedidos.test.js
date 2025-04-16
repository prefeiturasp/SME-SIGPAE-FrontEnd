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
import { mockPedidosCODAEInversaoCardapio } from "mocks/services/inversaoDeDiaDeCardapio.service/CODAE/pedidoCODAEInversaoDeCardapio.js";
import PainelPedidosInversaoCardapioCODAEPage from "pages/CODAE/InversaoDiaCardapio/PainelPedidosPage.jsx";
import { mockLotesSimples } from "mocks/lote.service/mockLotesSimples";
import { mockMeusDadosCogestor } from "mocks/meusDados/cogestor";
import { mockDiretoriaRegionalSimplissima } from "mocks/diretoriaRegional.service/mockDiretoriaRegionalSimplissima";

describe("Teste Página do Painel Pedidos - CODAE - Inversão de dia de Cardápio", () => {
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCogestor);
    mock.onGet("/lotes-simples/").reply(200, mockLotesSimples);
    mock
      .onGet("/diretorias-regionais-simplissima/")
      .reply(200, { results: mockDiretoriaRegionalSimplissima.results });
    mock
      .onGet("/inversoes-dia-cardapio/pedidos-codae/sem_filtro/")
      .reply(200, { results: mockPedidosCODAEInversaoCardapio.results });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA
    );
    localStorage.setItem(
      "perfil",
      PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA
    );

    await act(async () => {
      render(
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/",
              state: {
                filtros: { lotes: undefined, diretoria_regional: undefined },
              },
            },
          ]}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <PainelPedidosInversaoCardapioCODAEPage />
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

    const divLimite = screen.getByTestId("regular");
    expect(divLimite).toHaveTextContent("8AE3D");
    expect(divLimite).toHaveTextContent("017981");
    expect(divLimite).toHaveTextContent("EMEF PERICLES EUGENIO DA SILVA RAMOS");
    expect(divLimite).toHaveTextContent("24/04/2025");
  });

  it("busca por diretoria regional  e lote", async () => {
    await act(async () => {
      fireEvent.mouseDown(
        screen
          .getByTestId("select-diretoria-regional")
          .querySelector(".ant-select-selection-search-input")
      );
    });

    await waitFor(() => screen.getByText("BUTANTA"));
    await act(async () => {
      fireEvent.click(screen.getByText("BUTANTA"));
    });

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
