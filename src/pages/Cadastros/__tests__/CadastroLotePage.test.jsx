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

jest.mock("src/components/screens/Cadastros/CadastroLote/Container", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="cadastro-lote-container">
      <span>Formulário de Cadastro de Lote</span>
    </div>
  ),
}));

import CadastroLotePage from "../CadastroLotePage";

describe("CadastroLotePage", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it("deve renderizar corretamente todos os componentes e dados esperados", () => {
    render(<CadastroLotePage />);

    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(
      screen.getAllByText("Cadastro de Lote").length
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Voltar")).toBeInTheDocument();
    expect(
      screen.getByText("Voltar para: /configuracoes/cadastros")
    ).toBeInTheDocument();

    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    expect(screen.getByText("/")).toBeInTheDocument();
    expect(screen.getByText("Cadastros")).toBeInTheDocument();
    expect(
      screen.getAllByText("Cadastro de Lote").length
    ).toBeGreaterThanOrEqual(1);

    expect(screen.getByTestId("cadastro-lote-container")).toBeInTheDocument();
    expect(
      screen.getByText("Formulário de Cadastro de Lote")
    ).toBeInTheDocument();
  });
});
