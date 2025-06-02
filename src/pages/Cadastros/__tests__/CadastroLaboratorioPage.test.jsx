import "@testing-library/jest-dom";
import React from "react";
import { render, screen, cleanup } from "@testing-library/react";

jest.mock("components/Shareable/Breadcrumb", () => ({
  __esModule: true,
  default: ({ home, anteriores, atual }) => (
    <nav data-testid="breadcrumb">
      <span>{home}</span>
      <span>{anteriores?.[0]?.titulo}</span>
      <span>{anteriores?.[1]?.titulo}</span>
      <span>{atual?.titulo}</span>
    </nav>
  ),
}));

jest.mock("components/Shareable/Page/Page", () => ({
  __esModule: true,
  default: ({ titulo, botaoVoltar, voltarPara, children }) => (
    <section data-testid="page">
      <h1>{titulo}</h1>
      {botaoVoltar && <button>Voltar</button>}
      <p>Voltar para: {voltarPara}</p>
      {children}
    </section>
  ),
}));

jest.mock(
  "components/screens/Cadastros/Laboratorios/components/CadastroLaboratorio",
  () => ({
    __esModule: true,
    default: () => (
      <div data-testid="cadastro-laboratorio">
        <span>Formulário de Cadastro de Laboratório</span>
      </div>
    ),
  })
);

import CadastroLaboratorioPage from "../CadastroLaboratorioPage";

describe("CadastroLaboratorioPage", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it("deve renderizar corretamente todos os elementos da página", () => {
    render(<CadastroLaboratorioPage />);

    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(
      screen.getAllByText("Cadastrar Laboratório").length
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Voltar")).toBeInTheDocument();
    expect(
      screen.getByText("Voltar para: /configuracoes/cadastros/laboratorios")
    ).toBeInTheDocument();

    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    expect(screen.getByText("/")).toBeInTheDocument();
    expect(screen.getByText("Cadastros")).toBeInTheDocument();
    expect(screen.getByText("Laboratórios")).toBeInTheDocument();
    expect(
      screen.getAllByText("Cadastrar Laboratório").length
    ).toBeGreaterThanOrEqual(1);

    expect(screen.getByTestId("cadastro-laboratorio")).toBeInTheDocument();
    expect(
      screen.getByText("Formulário de Cadastro de Laboratório")
    ).toBeInTheDocument();
  });
});
