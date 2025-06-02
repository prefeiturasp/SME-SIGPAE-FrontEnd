import "@testing-library/jest-dom";
import React from "react";
import { render, screen, cleanup } from "@testing-library/react";

jest.mock("components/Shareable/Breadcrumb", () => ({
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

jest.mock("components/Shareable/Page/Page", () => ({
  __esModule: true,
  default: ({ titulo, botaoVoltar, children }) => (
    <section data-testid="page">
      <h1>{titulo}</h1>
      {botaoVoltar && <button>Voltar</button>}
      {children}
    </section>
  ),
}));

jest.mock("components/Shareable/Calendario", () => ({
  __esModule: true,
  Calendario: ({ nomeObjeto, nomeObjetoMinusculo }) => (
    <div data-testid="calendario">
      <span>{`Nome Objeto: ${nomeObjeto}`}</span>
      <span>{`Nome Objeto (minúsculo): ${nomeObjetoMinusculo}`}</span>
    </div>
  ),
}));

jest.mock("services/cadastroDiasSuspensaoAtividades.service", () => ({
  getDiasSuspensaoAtividades: jest.fn(),
  setDiaSuspensaoAtividades: jest.fn(),
  deleteDiaSuspensaoAtividades: jest.fn(),
}));

jest.mock("src/helpers/utilities", () => ({
  usuarioEhCODAEGestaoAlimentacao: jest.fn(() => true),
  usuarioEhMedicao: jest.fn(() => false),
}));

import { CadastroSuspensaoDeAtividadesPage } from "../CadastroSuspensaoAtividades";

describe("CadastroSuspensaoDeAtividadesPage", () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it("renderiza todos os elementos corretamente com título, breadcrumb, botão e calendário", () => {
    render(<CadastroSuspensaoDeAtividadesPage />);

    const titulos = screen.getAllByText("Suspensão de Atividades");
    expect(titulos.length).toBeGreaterThan(0);

    expect(screen.getByText("Voltar")).toBeInTheDocument();

    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    expect(screen.getByText("Cadastros")).toBeInTheDocument();

    expect(screen.getByTestId("calendario")).toBeInTheDocument();
    expect(
      screen.getByText("Nome Objeto: Suspensão de Atividades")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Nome Objeto (minúsculo): suspensão de atividades")
    ).toBeInTheDocument();
  });
});
