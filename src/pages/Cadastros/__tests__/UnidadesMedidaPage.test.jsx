import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import UnidadesMedidaPage from "../UnidadesMedidaPage";

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

jest.mock("src/components/screens/Cadastros/UnidadesMedida", () => {
  return () => (
    <div data-testid="mock-unidades-medida">Componente Unidades de Medida</div>
  );
});

afterEach(cleanup);

describe("UnidadesMedidaPage", () => {
  test("deve renderizar a página com título, breadcrumb e componente UnidadesMedida", () => {
    render(<UnidadesMedidaPage />);

    expect(screen.getByTestId("mock-page")).toBeInTheDocument();
    expect(screen.getByText("Unidades de Medida")).toBeInTheDocument();
    expect(screen.getByText("Voltar habilitado")).toBeInTheDocument();
    expect(screen.getByText("Voltar para: /")).toBeInTheDocument();

    expect(screen.getByTestId("mock-breadcrumb")).toBeInTheDocument();
    expect(screen.getByText("Home: /")).toBeInTheDocument();
    expect(
      screen.getByText("Cadastros (/configuracoes/cadastros)")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Atual: Unidades de Medida (/configuracoes/cadastros/unidades-medida)"
      )
    ).toBeInTheDocument();

    expect(screen.getByTestId("mock-unidades-medida")).toBeInTheDocument();
  });
});
