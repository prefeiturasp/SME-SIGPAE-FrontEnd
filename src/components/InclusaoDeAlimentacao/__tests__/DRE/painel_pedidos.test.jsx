import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { mockPedidosCODAEInclusaoCEI } from "src/mocks/InclusaoAlimentacao/mockPedidosCODAEInclusaoCEI";
import { mockPedidosCODAEInclusaoContinua } from "src/mocks/InclusaoAlimentacao/mockPedidosCODAEInclusaoContinua";
import { mockPedidosCODAEInclusaoNormal } from "src/mocks/InclusaoAlimentacao/mockPedidosCODAEInclusaoNormal";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockLotesSimples } from "src/mocks/lote.service/mockLotesSimples";
import { mockMeusDadosCogestor } from "src/mocks/meusDados/cogestor";
import PainelPedidosInclusaoDeAlimentacaoDREPage from "src/pages/DRE/InclusaoDeAlimentacao/PainelPedidosPage";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";

describe("Teste Página do Painel Pedidos - DRE - Inclusão de Alimentação", () => {
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCogestor);
    mock.onGet("/lotes-simples/").reply(200, mockLotesSimples);
    mock
      .onGet(
        "/grupos-inclusao-alimentacao-normal/pedidos-diretoria-regional/sem_filtro/"
      )
      .reply("200", { results: mockPedidosCODAEInclusaoNormal.results });
    mock
      .onGet(
        "/inclusoes-alimentacao-continua/pedidos-diretoria-regional/sem_filtro/"
      )
      .reply("200", { results: mockPedidosCODAEInclusaoContinua.results });
    mock
      .onGet(
        "/inclusoes-alimentacao-da-cei/pedidos-diretoria-regional/sem_filtro/"
      )
      .reply("200", { results: mockPedidosCODAEInclusaoCEI.results });
    mock
      .onGet(
        "/inclusoes-alimentacao-cemei/pedidos-diretoria-regional/sem_filtro/"
      )
      .reply("200", { results: [] });

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
          <PainelPedidosInclusaoDeAlimentacaoDREPage />
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
    const divPrioritarios = screen.getByTestId("prioritario");
    expect(divPrioritarios).toHaveTextContent("1 escola solicitante");
    expect(divPrioritarios).toHaveTextContent("F85D5");
    expect(divPrioritarios).toHaveTextContent("017981");
    expect(divPrioritarios).toHaveTextContent(
      "EMEF PERICLES EUGENIO DA SILVA RAMOS"
    );
    expect(divPrioritarios).toHaveTextContent("30/01/2025");

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
