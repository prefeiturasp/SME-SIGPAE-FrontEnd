import "@testing-library/jest-dom";
import React from "react";
import { render, screen, cleanup } from "@testing-library/react";

jest.mock("components/Shareable/Breadcrumb", () => ({
  __esModule: true,
  default: ({ home, atual }) => (
    <nav data-testid="breadcrumb">
      <span>{home}</span>
      <span>{atual?.titulo}</span>
    </nav>
  ),
}));

jest.mock("components/Shareable/Page/Page", () => ({
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

jest.mock("components/screens/Cadastros/CadastroGeral", () => ({
  __esModule: true,
  default: ({ tipoFixo }) => (
    <div data-testid="cadastro-geral">
      <span>Tipo: {tipoFixo}</span>
    </div>
  ),
}));

import CadastroMarcaPage from "../CadastroMarcaPage";

describe("CadastroMarcaPage", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it("deve renderizar corretamente todos os elementos da página", () => {
    render(<CadastroMarcaPage />);

    expect(screen.getByTestId("page")).toBeInTheDocument();

    expect(screen.getAllByText("Marcas").length).toBeGreaterThanOrEqual(1);

    expect(screen.getByText("Voltar")).toBeInTheDocument();

    expect(screen.getByText("Voltar para: /")).toBeInTheDocument();

    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();

    expect(screen.getByText("/")).toBeInTheDocument();

    expect(screen.getAllByText("Marcas").length).toBeGreaterThanOrEqual(1);

    expect(screen.getByTestId("cadastro-geral")).toBeInTheDocument();

    expect(screen.getByText("Tipo: MARCA")).toBeInTheDocument();
  });
});
