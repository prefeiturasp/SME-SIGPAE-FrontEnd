import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockLotesSimples } from "src/mocks/lote.service/mockLotesSimples";
import { mockMeusDadosCogestor } from "src/mocks/meusDados/cogestor";
import { mockPedidosDREAlteracaoCardapio } from "src/mocks/services/alteracaoCardapio.service/DRE/pedidosDREAlteracaoCardapio";
import { mockPedidosDREAlteracaoCardapioCEI } from "src/mocks/services/alteracaoCardapio.service/DRE/pedidosDREAlteracaoCardapioCEI";
import { mockPedidosDREAlteracaoCardapioCEMEI } from "src/mocks/services/alteracaoCardapio.service/DRE/pedidosDREAlteracaoCardapioCEMEI";
import PainelPedidosAlteracaoCardapioDREPage from "src/pages/DRE/AlteracaoDeCardapio/PainelPedidosPage.jsx";
import mock from "src/services/_mock";

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

  it("filtra opções de lote pela busca", async () => {
    const selectLote = screen.getByTestId("select-lote");
    await act(async () => {
      fireEvent.mouseDown(
        selectLote.querySelector(".ant-select-selection-search-input"),
      );
    });

    await waitFor(() => screen.getByText("BT - 1"));
    await act(async () => {
      fireEvent.change(
        selectLote.querySelector(".ant-select-selection-search-input"),
        { target: { value: "bt" } },
      );
    });
    expect(screen.getByText("BT - 1")).toBeInTheDocument();
  });

  it("submete o formulário", async () => {
    const formElement = document.querySelector("form");
    fireEvent.submit(formElement);
  });
});

describe("Painel Pedidos DRE - cenário de erro ao carregar lotes", () => {
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCogestor);
    mock
      .onGet("/lotes-simples/")
      .reply(500, { detail: "Erro ao carregar lotes" });
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
        </MemoryRouter>,
      );
    });
  });

  it("renderiza blocos de solicitações mesmo sem lotes", async () => {
    expect(
      screen.getByText("Solicitações no prazo limite"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Solicitações no prazo regular"),
    ).toBeInTheDocument();
  });
});
