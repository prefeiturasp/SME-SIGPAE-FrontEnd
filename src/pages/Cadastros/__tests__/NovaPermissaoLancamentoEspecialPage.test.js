import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import NovaPermissaoLancamentoEspecialPage from "../NovaPermissaoLancamentoEspecialPage";
jest.mock("react-router-dom", () => ({
  useLocation: jest.fn(),
}));
jest.mock("../../../components/Shareable/Breadcrumb", () => {
  return function MockBreadcrumb() {
    return _jsx("div", {
      "data-testid": "breadcrumb",
      children: "Mock Breadcrumb",
    });
  };
});
jest.mock("../../../components/Shareable/Page/Page", () => {
  return function MockPage({ children, titulo }) {
    return _jsxs("div", {
      "data-testid": "page",
      children: [_jsx("h1", { children: titulo }), children],
    });
  };
});
jest.mock(
  "../../../components/screens/Cadastros/NovaPermissaoLancamentoEspecial",
  () => ({
    NovaPermissaoLancamentoEspecial: () =>
      _jsx("div", {
        "data-testid": "nova-permissao",
        children: "Mock Nova Permiss\u00E3o",
      }),
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
    render(_jsx(NovaPermissaoLancamentoEspecialPage, {}));
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
    render(_jsx(NovaPermissaoLancamentoEspecialPage, {}));
    expect(
      screen.getByText("Nova Permissão de Lançamento Especial")
    ).toBeInTheDocument();
    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    expect(screen.getByTestId("nova-permissao")).toBeInTheDocument();
  });
});
