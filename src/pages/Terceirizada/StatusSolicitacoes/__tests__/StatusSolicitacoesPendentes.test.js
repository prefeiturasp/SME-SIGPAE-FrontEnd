import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import StatusSolicitacoesPendentes from "../StatusSolicitacoesPendentes";

jest.mock("src/components/Shareable/Breadcrumb", () => () => (
  <div data-testid="breadcrumb" />
));
jest.mock("src/components/Shareable/Page/Page", () => ({ children }) => (
  <div data-testid="page">{children}</div>
));
jest.mock(
  "src/components/screens/DashboardTerceirizada/StatusSolicitacoes",
  () => () => <div data-testid="status-solicitacoes" />
);

jest.mock("src/services/painelTerceirizada.service", () => ({
  getSolicitacoesPendentesTerceirizada: jest.fn(),
}));
jest.mock("src/components/screens/helper", () => ({
  ajustarFormatoLog: jest.fn(),
}));

describe("StatusSolicitacoesPendentes", () => {
  it("deve renderizar todos os elementos da página corretamente", () => {
    render(
      <MemoryRouter>
        <StatusSolicitacoesPendentes />
      </MemoryRouter>
    );

    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(screen.getByTestId("status-solicitacoes")).toBeInTheDocument();
  });
});
