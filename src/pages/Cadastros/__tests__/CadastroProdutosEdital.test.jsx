import "@testing-library/jest-dom";
import React from "react";
import { render, screen, cleanup } from "@testing-library/react";

jest.mock("src/components/Shareable/Breadcrumb", () => ({
  __esModule: true,
  default: ({ home, atual }) => (
    <nav data-testid="breadcrumb">
      <span>{home}</span>
      <span>{atual?.titulo}</span>
    </nav>
  ),
}));

jest.mock("src/components/Shareable/Page/Page", () => ({
  __esModule: true,
  default: ({ titulo, botaoVoltar, voltarPara, children }) => (
    <main data-testid="page">
      <h1>{titulo}</h1>
      {botaoVoltar && <button>Voltar</button>}
      <p>Voltar para: {voltarPara}</p>
      {children}
    </main>
  ),
}));

jest.mock("src/components/screens/Cadastros/CadastroProdutosEdital", () => ({
  __esModule: true,
  default: () => (
    <section data-testid="cadastro-produtos-edital">
      <span>Formulário de Cadastro de Produtos do Edital</span>
    </section>
  ),
}));

import CadastroProdutosEditalPage from "../CadastroProdutosEdital";

describe("CadastroProdutosEditalPage", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it("deve renderizar corretamente todos os elementos esperados", () => {
    render(<CadastroProdutosEditalPage />);

    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(
      screen.getAllByText("Cadastro de Produtos Provenientes do Edital").length
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Voltar")).toBeInTheDocument();
    expect(screen.getByText("Voltar para: /")).toBeInTheDocument();

    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    expect(screen.getByText("/")).toBeInTheDocument();
    expect(
      screen.getAllByText("Cadastro de Produtos Provenientes do Edital").length
    ).toBeGreaterThanOrEqual(1);

    expect(screen.getByTestId("cadastro-produtos-edital")).toBeInTheDocument();
    expect(
      screen.getByText("Formulário de Cadastro de Produtos do Edital")
    ).toBeInTheDocument();
  });
});
