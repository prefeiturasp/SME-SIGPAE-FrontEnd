import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { StatusSolicitacoesAutorizadasTerceirizadaPage } from "../StatusSolicitacoesAutorizadas";
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

jest.mock("src/services/painelTerceirizada.service", () => ({
  getSolicitacoesAutorizadasTerceirizada: jest.fn(),
}));

describe("StatusSolicitacoesAutorizadasTerceirizadaPage - Testes completos", () => {
  const mockMeusDados = {
    vinculo_atual: {
      instituicao: {
        lotes: [
          { nome: "Lote 1", uuid: "abc123" },
          { nome: "Lote 2", uuid: "def456" },
        ],
      },
    },
  };

  it("deve renderizar a página corretamente com meusDados disponíveis", () => {
    render(
      <MemoryRouter>
        <MeusDadosContext.Provider value={{ meusDados: mockMeusDados }}>
          <StatusSolicitacoesAutorizadasTerceirizadaPage />
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
          <StatusSolicitacoesAutorizadasTerceirizadaPage />
        </MeusDadosContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    expect(
      screen.queryByTestId("solicitacoes-generico")
    ).not.toBeInTheDocument();
  });
});
