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
import { mockPedidosCODAEInversaoCardapio } from "src/mocks/services/inversaoDeDiaDeCardapio.service/CODAE/pedidoCODAEInversaoDeCardapio";
import PainelPedidosInversaoCardapioCODAEPage from "src/pages/CODAE/InversaoDiaCardapio/PainelPedidosPage.jsx";
import { mockLotesSimples } from "src/mocks/lote.service/mockLotesSimples";
import { mockMeusDadosCogestor } from "src/mocks/meusDados/cogestor";
import { mockDiretoriaRegionalSimplissima } from "src/mocks/diretoriaRegional.service/mockDiretoriaRegionalSimplissima";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { getCODAEPedidosDeInversoes } from "src/services/inversaoDeDiaDeCardapio.service";

jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  ...jest.requireActual("src/components/Shareable/Toast/dialogs"),
  toastError: jest.fn(),
}));

jest.mock("src/services/inversaoDeDiaDeCardapio.service", () => ({
  ...jest.requireActual("src/services/inversaoDeDiaDeCardapio.service"),
  getCODAEPedidosDeInversoes: jest.fn(),
}));

describe("Teste Página do Painel Pedidos - CODAE - Inversão de dia de Cardápio", () => {
  beforeEach(async () => {
    jest.clearAllMocks();

    getCODAEPedidosDeInversoes.mockResolvedValue({
      results: mockPedidosCODAEInversaoCardapio.results,
    });

    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCogestor);
    mock.onGet("/lotes-simples/").reply(200, mockLotesSimples);
    mock
      .onGet("/diretorias-regionais-simplissima/")
      .reply(200, { results: mockDiretoriaRegionalSimplissima.results });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
    );
    localStorage.setItem(
      "perfil",
      PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA,
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
          .querySelector(".ant-select-selection-search-input"),
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

    getCODAEPedidosDeInversoes.mockResolvedValueOnce({
      status: 400,
      data: {
        detail: "Erro retornado pelo backend",
      },
      results: [],
    });

    await act(async () => {
      fireEvent.mouseDown(
        screen
          .getByTestId("select-diretoria-regional")
          .querySelector(".ant-select-selection-search-input"),
      );
    });

    const opcaoButanta = await screen.findByText("BUTANTA");

    await act(async () => {
      fireEvent.click(opcaoButanta);
    });

    await waitFor(() => {
      expect(toastError).toHaveBeenCalled();
    });
  });

  it("filtra opções de diretoria regional e lote pelo texto digitado", async () => {
    const selectDre = screen
      .getByTestId("select-diretoria-regional")
      .querySelector(".ant-select-selection-search-input");

    await act(async () => {
      fireEvent.mouseDown(selectDre);
      fireEvent.change(selectDre, {
        target: { value: "BUT" },
      });
    });

    await waitFor(() => {
      expect(screen.getByText("BUTANTA")).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByText("BUTANTA"));
    });

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
