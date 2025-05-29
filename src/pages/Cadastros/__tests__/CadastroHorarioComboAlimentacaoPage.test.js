import "@testing-library/jest-dom";
import React from "react";
import { render, screen, cleanup } from "@testing-library/react";

jest.mock("components/Shareable/Breadcrumb", () => ({
  __esModule: true,
  default: ({ home, anteriores, atual }) => (
    <nav data-testid="breadcrumb">
      <span>{home}</span>
      <span>{anteriores?.[0]?.titulo}</span>
      <span>{atual?.titulo}</span>
    </nav>
  ),
}));

jest.mock(
  "components/screens/Cadastros/CadastroHorarioComboAlimentacao/Container",
  () => ({
    __esModule: true,
    default: () => (
      <div data-testid="container-combo">
        <span>Container de Cadastro Horário Combo</span>
      </div>
    ),
  })
);

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

import CadastroHorarioComboAlimentacaoPage from "../CadastroHorarioComboAlimentacaoPage";

describe("CadastroHorarioComboAlimentacaoPage", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it("deve renderizar corretamente todos os componentes e informações", () => {
    render(<CadastroHorarioComboAlimentacaoPage />);

    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(
      screen.getAllByText("Horário de fornecimento de alimentação").length
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Voltar")).toBeInTheDocument();
    expect(
      screen.getByText("Voltar para: /configuracoes/cadastros")
    ).toBeInTheDocument();

    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    expect(screen.getByText("/")).toBeInTheDocument();
    expect(screen.getByText("Cadastros")).toBeInTheDocument();

    expect(screen.getByTestId("container-combo")).toBeInTheDocument();
    expect(
      screen.getByText("Container de Cadastro Horário Combo")
    ).toBeInTheDocument();
  });
});
