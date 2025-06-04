import "@testing-library/jest-dom";
import React from "react";
import { render, screen, cleanup } from "@testing-library/react";

jest.mock("src/components/Shareable/Breadcrumb", () => ({
  __esModule: true,
  default: ({ home, anteriores, atual }) => (
    <nav data-testid="breadcrumb">
      <span>{home}</span>
      {anteriores.map((item, index) => (
        <span key={index}>{item.titulo}</span>
      ))}
      <span>{atual.titulo}</span>
    </nav>
  ),
}));

jest.mock("src/components/Shareable/Page/Page", () => ({
  __esModule: true,
  default: ({ titulo, botaoVoltar, children }) => (
    <section data-testid="page">
      <h1>{titulo}</h1>
      {botaoVoltar && <button>Voltar</button>}
      {children}
    </section>
  ),
}));

jest.mock("src/components/Shareable/Calendario", () => ({
  __esModule: true,
  Calendario: ({ nomeObjeto, nomeObjetoMinusculo }) => (
    <div data-testid="calendario">
      <span>{`Nome Objeto: ${nomeObjeto}`}</span>
      <span>{`Nome Objeto (minúsculo): ${nomeObjetoMinusculo}`}</span>
    </div>
  ),
}));

jest.mock("src/services/medicaoInicial/diaSobremesaDoce.service", () => ({
  getDiasSobremesaDoce: jest.fn(),
  setDiaSobremesaDoce: jest.fn(),
  deleteDiaSobremesaDoce: jest.fn(),
}));

jest.mock("src/helpers/utilities", () => ({
  usuarioEhCODAEGestaoAlimentacao: jest.fn(() => true),
}));

import { CadastroSobremesaDocePage } from "../CadastroSobremesaDocePage";

describe("CadastroSobremesaDocePage", () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it("renderiza corretamente todos os elementos da página", () => {
    render(<CadastroSobremesaDocePage />);

    const textos = screen.getAllByText("Sobremesa Doce");
    expect(textos.length).toBeGreaterThan(0);

    expect(screen.getByText("Voltar")).toBeInTheDocument();

    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    expect(screen.getByText("/")).toBeInTheDocument();
    expect(screen.getByText("Cadastros")).toBeInTheDocument();

    expect(screen.getByTestId("calendario")).toBeInTheDocument();
    expect(screen.getByText("Nome Objeto: Sobremesa Doce")).toBeInTheDocument();
    expect(
      screen.getByText("Nome Objeto (minúsculo): sobremesa doce")
    ).toBeInTheDocument();
  });
});
