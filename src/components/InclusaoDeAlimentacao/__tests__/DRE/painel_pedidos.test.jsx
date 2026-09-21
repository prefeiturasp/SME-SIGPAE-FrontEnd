import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockLotesSimples } from "src/mocks/lote.service/mockLotesSimples";
import { mockMeusDadosCogestor } from "src/mocks/meusDados/cogestor";
import PainelPedidosInclusaoDeAlimentacaoDREPage from "src/pages/DRE/InclusaoDeAlimentacao/PainelPedidosPage";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";
import { dreListarSolicitacoesDeInclusaoDeAlimentacao } from "src/services/inclusaoDeAlimentacao/dre.service";

jest.mock("src/services/inclusaoDeAlimentacao/dre.service");

const pedidoPrioritario = {
  uuid: "uuid-prioritario",
  id_externo: "PRIO01",
  prioridade: "PRIORITARIO",
  data_inicial: "30/01/2025",
  escola: {
    uuid: "escola-1",
    nome: "EMEF TESTE",
    codigo_eol: "000001",
  },
  solicitacoes_similares: [],
};

const pedidoLimite = {
  ...pedidoPrioritario,
  uuid: "uuid-limite",
  id_externo: "LIM01",
  prioridade: "LIMITE",
};

const pedidoRegular = {
  ...pedidoPrioritario,
  uuid: "uuid-regular",
  id_externo: "REG01",
  prioridade: "REGULAR",
};

const totais = { PRIORITARIO: 1, LIMITE: 1, REGULAR: 1 };

describe("Teste Página do Painel Pedidos - DRE - Inclusão de Alimentação", () => {
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCogestor);
    mock.onGet("/lotes-simples/").reply(200, mockLotesSimples);

    dreListarSolicitacoesDeInclusaoDeAlimentacao.mockImplementation(
      (filtro, params) => {
        if (params.prazo === "PRIORITARIO") {
          return Promise.resolve({
            count: 1,
            results: [pedidoPrioritario],
            escolas_solicitantes: 1,
            totais,
          });
        }
        if (params.prazo === "LIMITE") {
          return Promise.resolve({
            count: 1,
            results: [pedidoLimite],
            escolas_solicitantes: 1,
            totais,
          });
        }
        return Promise.resolve({
          count: 1,
          results: [pedidoRegular],
          escolas_solicitantes: 1,
          totais,
        });
      },
    );

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
        </MemoryRouter>,
      );
    });
  });

  it("renderiza blocos de solicitações vencendo, limite e regular", async () => {
    await waitFor(() => screen.getByTestId("prioritario"));

    expect(
      screen.getByText(
        "Solicitações próximas ao prazo de vencimento (2 dias ou menos)",
      ),
    ).toBeInTheDocument();
    const divPrioritarios = screen.getByTestId("prioritario");
    expect(divPrioritarios).toHaveTextContent("1 escola solicitante");
    expect(divPrioritarios).toHaveTextContent("PRIO01");
    expect(divPrioritarios).toHaveTextContent("000001");
    expect(divPrioritarios).toHaveTextContent("EMEF TESTE");

    expect(
      screen.getByText("Solicitações no prazo limite"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Solicitações no prazo regular"),
    ).toBeInTheDocument();
  });

  it("busca por lote", async () => {
    await waitFor(() => screen.getByTestId("select-lote"));

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
});
