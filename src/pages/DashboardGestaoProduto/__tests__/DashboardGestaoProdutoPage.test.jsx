import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PAINEL_GESTAO_PRODUTO } from "src/configs/constants";
import DashboardGestaoProdutoPage from "../DashboardGestaoProdutoPage";

jest.mock("src/components/Shareable/Page/Page", () => ({
  __esModule: true,
  default: ({ children, titulo }) => (
    <main>
      <h1>{titulo}</h1>
      {children}
    </main>
  ),
}));

jest.mock("src/components/screens/DashboardGestaoProduto", () => ({
  DashboardGestaoProduto: () => <div data-testid="dashboard-gestao-produto" />,
}));

describe("DashboardGestaoProdutoPage", () => {
  it("exibe o breadcrumb do Painel de Solicitações corretamente", () => {
    render(
      <MemoryRouter>
        <DashboardGestaoProdutoPage />
      </MemoryRouter>,
    );

    const linkInicio = screen.getByRole("link", { name: "Início" });
    const linkPainel = screen.getByRole("link", {
      name: "Painel de Solicitações",
    });

    expect(linkInicio).toHaveAttribute("href", "/");
    expect(linkInicio).not.toHaveClass("is-active");
    expect(linkPainel).toHaveAttribute("href", `/${PAINEL_GESTAO_PRODUTO}`);
    expect(linkPainel).toHaveClass("is-active");
  });

  it("mantém o título e o conteúdo do painel", () => {
    render(
      <MemoryRouter>
        <DashboardGestaoProdutoPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", {
        name: "Acompanhamento de produtos cadastrados",
      }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("dashboard-gestao-produto")).toBeInTheDocument();
  });
});
