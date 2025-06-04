import "@testing-library/jest-dom";
import React from "react";
import { render, screen, cleanup } from "@testing-library/react";

jest.mock("src/components/Shareable/Breadcrumb", () => ({
  __esModule: true,
  default: ({ home, anteriores, atual }) => (
    <div data-testid="breadcrumb">
      <span>{home}</span>
      <span>{anteriores?.[0]?.titulo}</span>
      <span>{atual?.titulo}</span>
    </div>
  ),
}));

jest.mock("src/components/Shareable/Page/Page", () => ({
  __esModule: true,
  default: ({ titulo, children, botaoVoltar, voltarPara }) => (
    <div data-testid="page">
      <h1>{titulo}</h1>
      {botaoVoltar && <button>Voltar</button>}
      <p>{voltarPara}</p>
      {children}
    </div>
  ),
}));

jest.mock(
  "src/components/screens/Cadastros/CadastroEmpresa/CadastroEmpresa",
  () => ({
    __esModule: true,
    CadastroEmpresa: () => (
      <div data-testid="cadastro-empresa">Cadastro Empresa</div>
    ),
  })
);

import CadastroEmpresaPage from "../CadastroEmpresaPage";

describe("CadastroEmpresaPage", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it("deve renderizar corretamente todos os componentes e props", () => {
    render(<CadastroEmpresaPage />);

    expect(screen.getByTestId("page")).toBeInTheDocument();

    expect(
      screen.getAllByText("Cadastro de Empresa").length
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Voltar")).toBeInTheDocument();
    expect(screen.getByText("/configuracoes/cadastros")).toBeInTheDocument();

    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    expect(screen.getByText("/")).toBeInTheDocument();
    expect(screen.getByText("Cadastros")).toBeInTheDocument();

    expect(screen.getByTestId("cadastro-empresa")).toBeInTheDocument();
  });
});
