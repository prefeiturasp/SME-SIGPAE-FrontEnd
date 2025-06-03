import "@testing-library/jest-dom";
import React from "react";
import { render, screen, cleanup } from "@testing-library/react";

jest.mock("src/components/Shareable/Breadcrumb", () => ({
  __esModule: true,
  default: ({ home, anteriores, atual }) => (
    <nav data-testid="breadcrumb">
      <span>{home}</span>
      {anteriores?.map((item, index) => (
        <span key={index}>{item.titulo}</span>
      ))}
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

jest.mock("src/components/screens/Cadastros/CadastroProdutosLogistica", () => ({
  __esModule: true,
  default: () => (
    <section data-testid="cadastro-produtos-logistica">
      <span>Formulário de Cadastro de Produto (Logística)</span>
    </section>
  ),
}));

import CadastroProdutosLogisticaPage from "../CadastroProdutosLogisticaPage";

describe("CadastroProdutosLogisticaPage", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it("deve renderizar corretamente todos os componentes e dados esperados", () => {
    render(<CadastroProdutosLogisticaPage />);

    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(
      screen.getAllByText("Cadastrar Produto").length
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Voltar")).toBeInTheDocument();
    expect(
      screen.getByText("Voltar para: /configuracoes/cadastros/produtos")
    ).toBeInTheDocument();

    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    expect(screen.getByText("/")).toBeInTheDocument();
    expect(screen.getByText("Cadastros")).toBeInTheDocument();
    expect(
      screen.getAllByText("Cadastrar Produto").length
    ).toBeGreaterThanOrEqual(1);

    expect(
      screen.getByTestId("cadastro-produtos-logistica")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Formulário de Cadastro de Produto (Logística)")
    ).toBeInTheDocument();
  });
});
