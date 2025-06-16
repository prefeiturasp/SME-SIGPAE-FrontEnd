import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import VincularProdutosEditaisPage from "../VincularProdutosEditaisPage";

jest.mock("src/components/Shareable/Page/Page", () => {
  return ({ children, titulo, botaoVoltar, voltarPara }) => (
    <div data-testid="mock-page">
      <h1>{titulo}</h1>
      <div>{botaoVoltar ? "Voltar habilitado" : "Voltar desabilitado"}</div>
      <div>{`Voltar para: ${voltarPara}`}</div>
      {children}
    </div>
  );
});

jest.mock("src/components/Shareable/Breadcrumb", () => {
  return ({ home, atual }) => (
    <nav data-testid="mock-breadcrumb">
      <div>{`Home: ${home}`}</div>
      <div>{`Atual: ${atual.titulo} (${atual.href})`}</div>
    </nav>
  );
});

jest.mock("src/components/screens/Cadastros/VincularProdutosEditais", () => {
  return () => (
    <div data-testid="mock-vincular-produtos">
      Componente VincularProdutosEditais
    </div>
  );
});

afterEach(cleanup);

describe("VincularProdutosEditaisPage", () => {
  test("deve renderizar a página com título, breadcrumb e componente VincularProdutosEditais", () => {
    render(<VincularProdutosEditaisPage />);

    expect(screen.getByTestId("mock-page")).toBeInTheDocument();
    expect(
      screen.getByText("Vincular Produtos aos Editais")
    ).toBeInTheDocument();
    expect(screen.getByText("Voltar habilitado")).toBeInTheDocument();
    expect(screen.getByText("Voltar para: /")).toBeInTheDocument();

    expect(screen.getByTestId("mock-breadcrumb")).toBeInTheDocument();
    expect(screen.getByText("Home: /")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Atual: Vincular Produtos aos Editais (/gestao-produto/vincular-produto-edital)"
      )
    ).toBeInTheDocument();

    expect(screen.getByTestId("mock-vincular-produtos")).toBeInTheDocument();
  });
});
