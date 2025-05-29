import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import PermissaoLancamentosEspeciaisPage from "../PermissaoLancamentosEspeciaisPage";

jest.mock("../../../components/Shareable/Page/Page", () => {
  return ({ children, titulo, botaoVoltar }: any) => (
    <div data-testid="mock-page">
      <div>{titulo}</div>
      <div>{botaoVoltar ? "Voltar habilitado" : "Voltar desabilitado"}</div>
      {children}
    </div>
  );
});

jest.mock("../../../components/Shareable/Breadcrumb", () => {
  return ({ home, anteriores, atual }: any) => (
    <nav data-testid="mock-breadcrumb">
      <div>{`Home: ${home}`}</div>
      {anteriores.map((item: any, index: number) => (
        <div key={index}>{`${item.titulo} (${item.href})`}</div>
      ))}
      <div>{`Atual: ${atual.titulo} (${atual.href})`}</div>
    </nav>
  );
});

jest.mock("components/screens/Cadastros/PermissaoLancamentosEspeciais", () => {
  return {
    PermissaoLancamentosEspeciais: () => (
      <div data-testid="mock-permissao">Componente de Permissão</div>
    ),
  };
});

afterEach(cleanup);

describe("PermissaoLancamentosEspeciaisPage", () => {
  test("deve renderizar a página com título, breadcrumb e componente de permissões", () => {
    render(<PermissaoLancamentosEspeciaisPage />);

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
