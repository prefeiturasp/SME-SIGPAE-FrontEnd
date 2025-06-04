import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import NovaPermissaoLancamentoEspecialPage from "../NovaPermissaoLancamentoEspecialPage";

jest.mock("react-router-dom", () => ({
  useLocation: jest.fn(),
}));

jest.mock("../../../components/Shareable/Breadcrumb", () => {
  return function MockBreadcrumb() {
    return <div data-testid="breadcrumb">Mock Breadcrumb</div>;
  };
});

jest.mock("../../../components/Shareable/Page/Page", () => {
  return function MockPage({
    children,
    titulo,
  }: {
    children: React.ReactNode;
    titulo: string;
  }) {
    return (
      <div data-testid="page">
        <h1>{titulo}</h1>
        {children}
      </div>
    );
  };
});

jest.mock(
  "../../../components/screens/Cadastros/NovaPermissaoLancamentoEspecial",
  () => ({
    NovaPermissaoLancamentoEspecial: () => (
      <div data-testid="nova-permissao">Mock Nova Permissão</div>
    ),
  })
);

const mockedUseLocation = require("react-router-dom").useLocation;

describe("NovaPermissaoLancamentoEspecialPage", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  test('renderiza corretamente quando rota inclui "editar"', () => {
    mockedUseLocation.mockReturnValue({
      pathname:
        "/configuracoes/cadastros/tipos-alimentacao/permissao-lancamentos-especiais/editar/123",
    });

    render(<NovaPermissaoLancamentoEspecialPage />);

    expect(
      screen.getByText("Editar Permissão de Lançamento Especial")
    ).toBeInTheDocument();
    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    expect(screen.getByTestId("nova-permissao")).toBeInTheDocument();
  });

  test('renderiza corretamente quando rota é "nova"', () => {
    mockedUseLocation.mockReturnValue({
      pathname:
        "/configuracoes/cadastros/tipos-alimentacao/permissao-lancamentos-especiais/nova",
    });

    render(<NovaPermissaoLancamentoEspecialPage />);

    expect(
      screen.getByText("Nova Permissão de Lançamento Especial")
    ).toBeInTheDocument();
    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    expect(screen.getByTestId("nova-permissao")).toBeInTheDocument();
  });
});
