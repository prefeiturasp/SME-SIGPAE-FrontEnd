import "@testing-library/jest-dom";
import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import GestaoRequisicaoEntregaPage from "../GestaoRequisicaoEntregaPage";

jest.mock("components/Shareable/Breadcrumb", () => () => (
  <div data-testid="breadcrumb">Breadcrumb</div>
));

jest.mock("components/Shareable/Page/Page", () => ({ children, ...props }) => (
  <div
    data-testid="page"
    data-voltar-para={props.voltarPara}
    data-titulo={props.titulo}
  >
    {children}
  </div>
));

jest.mock("components/screens/Logistica/GestaoRequisicaoEntrega", () => () => (
  <div data-testid="gestao-requisicao">Gestão Requisição</div>
));

describe("GestaoRequisicaoEntregaPage", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it("deve renderizar todos os elementos corretamente com as props esperadas", () => {
    render(<GestaoRequisicaoEntregaPage />);

    const page = screen.getByTestId("page");
    expect(page).toBeInTheDocument();
    expect(page).toHaveAttribute("data-voltar-para", "/");
    expect(page).toHaveAttribute("data-titulo", "Requisição de Entrega");

    const breadcrumb = screen.getByTestId("breadcrumb");
    expect(breadcrumb).toBeInTheDocument();

    const gestao = screen.getByTestId("gestao-requisicao");
    expect(gestao).toBeInTheDocument();
  });
});
