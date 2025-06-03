import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { TIPO_PERFIL, TIPO_SOLICITACAO } from "src/constants/shared";
import { mockDiretoriaRegionalSimplissima } from "src/mocks/diretoriaRegional.service/mockDiretoriaRegionalSimplissima";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockLotesSimples } from "src/mocks/lote.service/mockLotesSimples";
import { mockPedidosCODAEAlteracaoCardapio } from "src/mocks/services/alteracaoCardapio.service/CODAE/pedidosCODAEAlteracaoCardapio";
import { mockPedidosCODAEAlteracaoCardapioCEMEI } from "src/mocks/services/alteracaoCardapio.service/CODAE/pedidosCODAEAlteracaoCardapioCEMEI";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { codaeListarSolicitacoesDeAlteracaoDeCardapio } from "src/services/alteracaoDeCardapio";
import { getDiretoriaregionalSimplissima } from "src/services/diretoriaRegional.service";
import { getLotesSimples } from "src/services/lote.service";
import Container from "../../CODAE/PainelPedidos/Container";

jest.mock("src/services/alteracaoDeCardapio");
jest.mock("src/services/lote.service");
jest.mock("src/services/diretoriaRegional.service");

const awaitServices = async () => {
  await waitFor(() => {
    expect(getDiretoriaregionalSimplissima).toHaveBeenCalled();
    expect(getLotesSimples).toHaveBeenCalled();
    expect(codaeListarSolicitacoesDeAlteracaoDeCardapio).toHaveBeenCalledTimes(
      3
    );
  });
};

describe("Teste <Container> do Painel Pedidos - CODAE - Alteração do Tipo de Alimentação", () => {
  beforeEach(async () => {
    getDiretoriaregionalSimplissima.mockResolvedValue({
      data: mockDiretoriaRegionalSimplissima,
      status: 200,
    });
    getLotesSimples.mockResolvedValue({
      data: mockLotesSimples,
      status: 200,
    });

    codaeListarSolicitacoesDeAlteracaoDeCardapio.mockImplementation(
      (_, tipoSolicitacao) => {
        if (tipoSolicitacao === TIPO_SOLICITACAO.SOLICITACAO_NORMAL) {
          return Promise.resolve({
            results: mockPedidosCODAEAlteracaoCardapio.results,
            status: 200,
          });
        } else if (tipoSolicitacao === TIPO_SOLICITACAO.SOLICITACAO_CEI) {
          return Promise.resolve({
            results: [],
            status: 200,
          });
        } else if (tipoSolicitacao === TIPO_SOLICITACAO.SOLICITACAO_CEMEI) {
          return Promise.resolve({
            results: mockPedidosCODAEAlteracaoCardapioCEMEI.results,
            status: 200,
          });
        }
        return Promise.resolve({
          data: { results: [] },
          status: 500,
        });
      }
    );

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA
    );

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Container
            filtros={{ lotes: undefined, diretoria_regional: undefined }}
          />
        </MemoryRouter>
      );
    });
  });

  it("renderiza blocos de solicitações vencendo, limite e regular", async () => {
    await awaitServices();

    expect(
      screen.getByText(
        "Solicitações próximas ao prazo de vencimento (2 dias ou menos)"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText("Solicitações no prazo limite")
    ).toBeInTheDocument();
    const divLimite = screen.getByTestId("limite");
    expect(divLimite).toHaveTextContent("1 escola solicitante");
    expect(divLimite).toHaveTextContent("996B9");
    expect(divLimite).toHaveTextContent("017981");
    expect(divLimite).toHaveTextContent("EMEF PERICLES EUGENIO DA SILVA RAMOS");
    expect(divLimite).toHaveTextContent("24/03/2025");

    expect(
      screen.getByText("Solicitações no prazo regular")
    ).toBeInTheDocument();
  });

  it("busca por dre e por lote", async () => {
    await awaitServices();
    await act(async () => {
      fireEvent.mouseDown(
        screen
          .getByTestId("select-diretoria-regional")
          .querySelector(".ant-select-selection-search-input")
      );
    });

    await waitFor(() => screen.getByText("IPIRANGA"));
    await act(async () => {
      fireEvent.click(screen.getByText("IPIRANGA"));
    });
    expect(codaeListarSolicitacoesDeAlteracaoDeCardapio).toHaveBeenCalledTimes(
      6
    );

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
    expect(codaeListarSolicitacoesDeAlteracaoDeCardapio).toHaveBeenCalledTimes(
      9
    );
  });
});
