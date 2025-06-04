import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProdutosLogisticaPage from "../ProdutosLogisticaPage";

jest.mock("src/components/Shareable/Page/Page", () => {
  return ({ children, titulo, botaoVoltar, voltarPara }) => (
    <div data-testid="mock-page">
      <div>{titulo}</div>
      <div>{botaoVoltar ? "Voltar habilitado" : "Voltar desabilitado"}</div>
      <div>{`Voltar para: ${voltarPara}`}</div>
      {children}
    </div>
  );
});

jest.mock("src/components/Shareable/Breadcrumb", () => {
  return ({ home, anteriores, atual }) => (
    <nav data-testid="mock-breadcrumb">
      <div>{`Home: ${home}`}</div>
      {anteriores.map((item, index) => (
        <div key={index}>{`${item.titulo} (${item.href})`}</div>
      ))}
      <div>{`Atual: ${atual.titulo} (${atual.href})`}</div>
    </nav>
  );
});

jest.mock("src/components/screens/Cadastros/ProdutosLogistica", () => {
  return () => (
    <div data-testid="mock-produtos">Componente Produtos Logística</div>
  );
});

afterEach(cleanup);

describe("ProdutosLogisticaPage", () => {
  test("renderiza todos os elementos corretamente", () => {
    render(<ProdutosLogisticaPage />);

    expect(screen.getByTestId("mock-page")).toBeInTheDocument();
    expect(screen.getByText("Produtos")).toBeInTheDocument();
    expect(screen.getByText("Voltar habilitado")).toBeInTheDocument();
    expect(screen.getByText("Voltar para: /")).toBeInTheDocument();

    expect(screen.getByTestId("mock-breadcrumb")).toBeInTheDocument();
    expect(screen.getByText("Home: /")).toBeInTheDocument();
    expect(
      screen.getByText("Cadastros (/configuracoes/cadastros)")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Atual: Produtos (/configuracoes/cadastros/produtos)")
    ).toBeInTheDocument();

    expect(screen.getByTestId("mock-produtos")).toBeInTheDocument();
  });
});
