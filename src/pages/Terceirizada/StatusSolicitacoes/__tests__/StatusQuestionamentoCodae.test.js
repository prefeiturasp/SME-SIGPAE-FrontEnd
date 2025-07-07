import React from "react";
import { render, screen } from "@testing-library/react";
import { StatusQuestionamentosCodae } from "../StatusQuestionamentosCodae";
import { MemoryRouter } from "react-router-dom";
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

describe("StatusQuestionamentosCodae - Página de status de questionamentos", () => {
  const mockMeusDados = {
    vinculo_atual: {
      instituicao: {
        lotes: [
          { nome: "Lote A", uuid: "uuid-a" },
          { nome: "Lote B", uuid: "uuid-b" },
        ],
      },
    },
  };

  it("deve renderizar a página corretamente com meusDados disponíveis", () => {
    render(
      <MemoryRouter>
        <MeusDadosContext.Provider value={{ meusDados: mockMeusDados }}>
          <StatusQuestionamentosCodae />
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
          <StatusQuestionamentosCodae />
        </MeusDadosContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    expect(
      screen.queryByTestId("solicitacoes-generico")
    ).not.toBeInTheDocument();
  });
});
