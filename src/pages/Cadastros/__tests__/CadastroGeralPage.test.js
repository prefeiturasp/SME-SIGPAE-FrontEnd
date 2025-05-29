import "@testing-library/jest-dom";
import React from "react";
import { render, screen, cleanup } from "@testing-library/react";

jest.mock("components/Shareable/Breadcrumb", () => ({
  __esModule: true,
  default: ({ home, atual }) => (
    <div data-testid="breadcrumb">
      <span>{home}</span>
      <span>{atual?.titulo}</span>
    </div>
  ),
}));

jest.mock("components/screens/Cadastros/CadastroGeral", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="cadastro-geral">
      <span>Componente CadastroGeral</span>
    </div>
  ),
}));

jest.mock("components/Shareable/Page/Page", () => ({
  __esModule: true,
  default: ({ titulo, botaoVoltar, voltarPara, children }) => (
    <div data-testid="page">
      <h1>{titulo}</h1>
      {botaoVoltar && <button>Voltar</button>}
      <p>Voltar para: {voltarPara}</p>
      {children}
    </div>
  ),
}));

import CadastroGeralPage from "../CadastroGeralPage";

describe("CadastroGeralPage", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it("deve renderizar todos os componentes corretamente com os dados esperados", () => {
    render(<CadastroGeralPage />);

    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(screen.getAllByText("Cadastro Geral").length).toBeGreaterThanOrEqual(
      1
    );
    expect(screen.getByText("Voltar")).toBeInTheDocument();
    expect(screen.getByText("Voltar para: /")).toBeInTheDocument();

    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    expect(screen.getByText("/")).toBeInTheDocument();

    expect(screen.getByTestId("cadastro-geral")).toBeInTheDocument();
    expect(screen.getByText("Componente CadastroGeral")).toBeInTheDocument();
  });
});
