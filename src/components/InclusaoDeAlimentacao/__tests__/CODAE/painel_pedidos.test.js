import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import { TIPO_PERFIL, TIPO_SOLICITACAO } from "constants/shared";
import { mockDiretoriaRegionalSimplissima } from "mocks/diretoriaRegional.service/mockDiretoriaRegionalSimplissima";
import { mockPedidosCODAEInclusaoCEI } from "mocks/InclusaoAlimentacao/mockPedidosCODAEInclusaoCEI";
import { mockPedidosCODAEInclusaoContinua } from "mocks/InclusaoAlimentacao/mockPedidosCODAEInclusaoContinua";
import { mockPedidosCODAEInclusaoNormal } from "mocks/InclusaoAlimentacao/mockPedidosCODAEInclusaoNormal";
import { localStorageMock } from "mocks/localStorageMock";
import { mockLotesSimples } from "mocks/lote.service/mockLotesSimples";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { getDiretoriaregionalSimplissima } from "services/diretoriaRegional.service";
import { codaeListarSolicitacoesDeInclusaoDeAlimentacao } from "services/inclusaoDeAlimentacao";
import { getLotesSimples } from "services/lote.service";
import Container from "../../CODAE/PainelPedidos/Container";

jest.mock("services/inclusaoDeAlimentacao");
jest.mock("services/lote.service");
jest.mock("services/diretoriaRegional.service");

const awaitServices = async () => {
  await waitFor(() => {
    expect(getDiretoriaregionalSimplissima).toHaveBeenCalled();
    expect(getLotesSimples).toHaveBeenCalled();
    expect(
      codaeListarSolicitacoesDeInclusaoDeAlimentacao
    ).toHaveBeenCalledTimes(4);
  });
};

describe("Teste <Container> do Painel Pedidos - CODAE - Inclusão de Alimentação", () => {
  beforeEach(async () => {
    getDiretoriaregionalSimplissima.mockResolvedValue({
      data: mockDiretoriaRegionalSimplissima,
      status: 200,
    });
    getLotesSimples.mockResolvedValue({
      data: mockLotesSimples,
      status: 200,
    });

    codaeListarSolicitacoesDeInclusaoDeAlimentacao.mockImplementation(
      (_, tipoSolicitacao) => {
        if (tipoSolicitacao === TIPO_SOLICITACAO.SOLICITACAO_NORMAL) {
          return Promise.resolve({
            results: mockPedidosCODAEInclusaoNormal.results,
            status: 200,
          });
        } else if (tipoSolicitacao === TIPO_SOLICITACAO.SOLICITACAO_CONTINUA) {
          return Promise.resolve({
            results: mockPedidosCODAEInclusaoContinua.results,
            status: 200,
          });
        } else if (tipoSolicitacao === TIPO_SOLICITACAO.SOLICITACAO_CEI) {
          return Promise.resolve({
            results: mockPedidosCODAEInclusaoCEI.results,
            status: 200,
          });
        } else if (tipoSolicitacao === TIPO_SOLICITACAO.SOLICITACAO_CEMEI) {
          return Promise.resolve({
            results: [],
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
  });
});
