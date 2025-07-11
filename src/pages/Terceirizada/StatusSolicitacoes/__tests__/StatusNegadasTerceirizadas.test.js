import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { StatusSolicitacoesNegadasTerceirizadaPage } from "../StatusSolicitacoesNegadasTerceirizada";
import { MeusDadosContext } from "src/context/MeusDadosContext";

jest.mock("src/components/Shareable/Breadcrumb", () => () => (
  <div data-testid="breadcrumb" />
));
jest.mock("src/components/Shareable/Page/Page", () => ({ children }) => (
  <div>{children}</div>
));
jest.mock("src/components/screens/SolicitacoesPorStatusGenerico", () => () => (
  <div data-testid="solicitacoes-generico" />
));
jest.mock("src/components/Shareable/CardLegendas", () => () => (
  <div data-testid="card-legendas" />
));

// Mock do serviço
jest.mock("src/services/painelTerceirizada.service", () => ({
  getSolicitacoesNegadasTerceirizada: jest.fn(),
}));

describe("StatusSolicitacoesNegadasTerceirizadaPage", () => {
  const mockMeusDados = {
    vinculo_atual: {
      instituicao: {
        lotes: [
          { nome: "Lote 01", uuid: "abc-123" },
          { nome: "Lote 02", uuid: "def-456" },
        ],
      },
    },
  };

  it("deve renderizar corretamente quando meusDados estiverem disponíveis", () => {
    render(
      <MemoryRouter>
        <MeusDadosContext.Provider value={{ meusDados: mockMeusDados }}>
          <StatusSolicitacoesNegadasTerceirizadaPage />
        </MeusDadosContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    expect(screen.getByTestId("solicitacoes-generico")).toBeInTheDocument();
  });

  it("não deve renderizar SolicitacoesPorStatusGenerico se meusDados estiverem ausentes", () => {
    render(
      <MemoryRouter>
        <MeusDadosContext.Provider value={{ meusDados: null }}>
          <StatusSolicitacoesNegadasTerceirizadaPage />
        </MeusDadosContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    expect(
      screen.queryByTestId("solicitacoes-generico")
    ).not.toBeInTheDocument();
  });
});
