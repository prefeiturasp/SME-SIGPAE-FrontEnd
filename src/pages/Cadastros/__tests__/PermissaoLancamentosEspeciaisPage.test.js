import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import PermissaoLancamentosEspeciaisPage from "../PermissaoLancamentosEspeciaisPage";
jest.mock("../../../components/Shareable/Page/Page", () => {
  return ({ children, titulo, botaoVoltar }) =>
    _jsxs("div", {
      "data-testid": "mock-page",
      children: [
        _jsx("div", { children: titulo }),
        _jsx("div", {
          children: botaoVoltar ? "Voltar habilitado" : "Voltar desabilitado",
        }),
        children,
      ],
    });
});
jest.mock("../../../components/Shareable/Breadcrumb", () => {
  return ({ home, anteriores, atual }) =>
    _jsxs("nav", {
      "data-testid": "mock-breadcrumb",
      children: [
        _jsx("div", { children: `Home: ${home}` }),
        anteriores.map((item, index) =>
          _jsx("div", { children: `${item.titulo} (${item.href})` }, index)
        ),
        _jsx("div", { children: `Atual: ${atual.titulo} (${atual.href})` }),
      ],
    });
});
jest.mock(
  "src/components/screens/Cadastros/PermissaoLancamentosEspeciais",
  () => {
    return {
      PermissaoLancamentosEspeciais: () =>
        _jsx("div", {
          "data-testid": "mock-permissao",
          children: "Componente de Permiss\u00E3o",
        }),
    };
  }
);
afterEach(cleanup);
describe("PermissaoLancamentosEspeciaisPage", () => {
  test("deve renderizar a página com título, breadcrumb e componente de permissões", () => {
    render(_jsx(PermissaoLancamentosEspeciaisPage, {}));
    expect(screen.getByTestId("mock-page")).toBeInTheDocument();
    expect(
      screen.getByText("Permissão de Lançamentos Especiais")
    ).toBeInTheDocument();
    expect(screen.getByText("Voltar habilitado")).toBeInTheDocument();
    expect(screen.getByTestId("mock-breadcrumb")).toBeInTheDocument();
    expect(screen.getByText("Home: /")).toBeInTheDocument();
    expect(
      screen.getByText("Cadastros (/configuracoes/cadastros)")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Cadastro de tipo de alimentação (/configuracoes/cadastros/tipos-alimentacao)"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Atual: Permissão de Lançamentos Especiais (/configuracoes/cadastros/tipos-alimentacao/permissao-lancamentos-especiais)"
      )
    ).toBeInTheDocument();
    expect(screen.getByTestId("mock-permissao")).toBeInTheDocument();
  });
});
