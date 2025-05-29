import "@testing-library/jest-dom";
import React from "react";
import { render, screen, cleanup } from "@testing-library/react";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
}));

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
    <section data-testid="page">
      <h1>{titulo}</h1>
      {botaoVoltar && <button>Voltar</button>}
      <p>{voltarPara}</p>
      {children}
    </section>
  ),
}));

jest.mock("components/screens/Cadastros/CadastroKitLanche", () => ({
  __esModule: true,
  default: ({ uuid }) => (
    <div data-testid="cadastro-kit-lanche">
      <span>UUID: {uuid ?? "novo"}</span>
    </div>
  ),
}));

import CadastroKitLanchePage from "../CadastroKitLanchePage";
import { useLocation } from "react-router-dom";

describe("CadastroKitLanchePage", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it("renderiza corretamente com UUID na URL (modo edição)", () => {
    useLocation.mockReturnValue({
      pathname: "/codae/cadastros/kits/abc123/editar",
    });

    render(<CadastroKitLanchePage />);

    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(
      screen.getAllByText("Edição de Modelo de KIT LANCHE").length
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Voltar")).toBeInTheDocument();
    expect(
      screen.getByText("/codae/cadastros/consulta-kits")
    ).toBeInTheDocument();

    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    expect(screen.getByText("/")).toBeInTheDocument();

    expect(screen.getByTestId("cadastro-kit-lanche")).toBeInTheDocument();
    expect(screen.getByText("UUID: abc123")).toBeInTheDocument();
  });

  it("renderiza corretamente sem UUID na URL (modo cadastro)", () => {
    useLocation.mockReturnValue({
      pathname: "/codae/cadastros/kits",
    });

    render(<CadastroKitLanchePage />);

    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(
      screen.getAllByText("Cadastro de Modelo de KIT LANCHE").length
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Voltar")).toBeInTheDocument();
    expect(
      screen.getByText("/codae/cadastros/consulta-kits")
    ).toBeInTheDocument();

    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    expect(screen.getByText("/")).toBeInTheDocument();

    expect(screen.getByTestId("cadastro-kit-lanche")).toBeInTheDocument();
    expect(screen.getByText("UUID: novo")).toBeInTheDocument();
  });
});
