import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import TiposEmbalagensCadastradosPage from "../TiposEmbalagensCadastradosPage";

jest.mock("components/Shareable/Page/Page", () => {
  return ({ children, titulo, botaoVoltar, voltarPara }) => (
    <div data-testid="mock-page">
      <div>{titulo}</div>
      <div>{botaoVoltar ? "Voltar habilitado" : "Voltar desabilitado"}</div>
      <div>{`Voltar para: ${voltarPara}`}</div>
      {children}
    </div>
  );
});

jest.mock("components/Shareable/Breadcrumb", () => {
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

jest.mock("components/screens/Cadastros/TiposEmbalagens", () => {
  return () => (
    <div data-testid="mock-tipos-embalagens">
      Componente Tipos de Embalagens
    </div>
  );
});

afterEach(cleanup);

describe("TiposEmbalagensCadastradosPage", () => {
  test("deve renderizar a página com título, breadcrumb e o componente TiposEmbalagens", () => {
    render(<TiposEmbalagensCadastradosPage />);

    expect(screen.getByTestId("mock-page")).toBeInTheDocument();
    expect(screen.getByText("Tipos de Embalagens")).toBeInTheDocument();
    expect(screen.getByText("Voltar habilitado")).toBeInTheDocument();
    expect(screen.getByText("Voltar para: /")).toBeInTheDocument();

    expect(screen.getByTestId("mock-breadcrumb")).toBeInTheDocument();
    expect(screen.getByText("Home: /")).toBeInTheDocument();
    expect(
      screen.getByText("Cadastros (/configuracoes/cadastros)")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Atual: Tipos de Embalagens (/configuracoes/cadastros/tipos-embalagens)"
      )
    ).toBeInTheDocument();

    expect(screen.getByTestId("mock-tipos-embalagens")).toBeInTheDocument();
  });
});
