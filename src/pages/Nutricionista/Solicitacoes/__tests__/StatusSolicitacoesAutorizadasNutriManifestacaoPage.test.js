import React from "react";
import { render, screen } from "@testing-library/react";
import StatusSolicitacoesAutorizadasNutriManifestacaoPage from "../StatusSolicitacoesAutorizadasNutriManifestacaoPage";

jest.mock("src/configs/constants", () => ({
  NUTRIMANIFESTACAO: "nutrimanifestacao",
  SOLICITACOES_AUTORIZADAS: "solicitacoes-autorizadas",
  HOME: { href: "/", titulo: "Home" },
}));

jest.mock("src/components/Shareable/Page/Page", () =>
  jest.fn(({ titulo, children }) => (
    <div data-testid="page-mock">
      <h1>{titulo}</h1>
      {children}
    </div>
  ))
);

jest.mock("src/components/Shareable/Breadcrumb", () =>
  jest.fn(({ home, atual }) => (
    <div data-testid="breadcrumb-mock">
      <a href={home?.href || "/"} data-testid="home-link">
        Home
      </a>
      <a href={atual.href} data-testid="current-link">
        {atual.titulo}
      </a>
    </div>
  ))
);

jest.mock("src/components/screens/SolicitacoesPorStatusGenerico", () => {
  return jest.fn(() => (
    <div data-testid="solicitacoes-por-status-generico-mock"></div>
  ));
});

describe("StatusSolicitacoesAutorizadasNutriManifestacaoPage", () => {
  it("deve renderizar o componente Page com título correto", () => {
    render(<StatusSolicitacoesAutorizadasNutriManifestacaoPage />);
    expect(
      screen.getByRole("heading", { name: "Solicitações Autorizadas" })
    ).toBeInTheDocument();
  });

  it("deve renderizar o Breadcrumb com os itens corretos", () => {
    render(<StatusSolicitacoesAutorizadasNutriManifestacaoPage />);

    expect(screen.getByTestId("breadcrumb-mock")).toBeInTheDocument();

    const homeLink = screen.getByTestId("home-link");
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveTextContent("Home");
    expect(homeLink).toHaveAttribute("href", "/");

    const currentLink = screen.getByTestId("current-link");
    expect(currentLink).toHaveTextContent("Solicitações Autorizadas");
    expect(currentLink).toHaveAttribute(
      "href",
      "/nutrimanifestacao/solicitacoes-autorizadas"
    );
  });

  it("deve renderizar o componente SolicitacoesPorStatusGenerico", () => {
    render(<StatusSolicitacoesAutorizadasNutriManifestacaoPage />);
    expect(
      screen.getByTestId("solicitacoes-por-status-generico-mock")
    ).toBeInTheDocument();
  });
});
