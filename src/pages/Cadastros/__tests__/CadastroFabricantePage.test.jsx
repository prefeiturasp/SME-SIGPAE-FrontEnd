import "@testing-library/jest-dom";
import React from "react";
import { render, screen, cleanup } from "@testing-library/react";

jest.mock("src/components/Shareable/Breadcrumb", () => ({
  __esModule: true,
  default: ({ home, atual }) => (
    <div data-testid="breadcrumb">
      <span>{home}</span>
      <span>{atual?.titulo}</span>
    </div>
  ),
}));

jest.mock("src/components/screens/Cadastros/CadastroGeral", () => ({
  __esModule: true,
  default: ({ tipoFixo }) => (
    <div data-testid="cadastro-geral">
      <span>Tipo: {tipoFixo}</span>
    </div>
  ),
}));

jest.mock("src/components/Shareable/Page/Page", () => ({
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

import CadastroFabricantePage from "../CadastroFabricantePage";

describe("CadastroFabricantePage", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it("deve renderizar corretamente todos os componentes com os dados esperados", () => {
    render(<CadastroFabricantePage />);

    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(screen.getAllByText("Fabricantes").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Voltar")).toBeInTheDocument();
    expect(screen.getByText("Voltar para: /")).toBeInTheDocument();

    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    expect(screen.getByText("/")).toBeInTheDocument();

    expect(screen.getByTestId("cadastro-geral")).toBeInTheDocument();
    expect(screen.getByText("Tipo: FABRICANTE")).toBeInTheDocument();
  });
});
