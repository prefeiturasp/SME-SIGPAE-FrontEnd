import "@testing-library/jest-dom";
import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import InsucessoEntregaPage from "../InsucessoEntregaPage";

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

jest.mock("components/screens/Logistica/InsucessoEntrega", () => () => (
  <div data-testid="insucesso-entrega">Insucesso Entrega</div>
));

describe("InsucessoEntregaPage", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it("deve renderizar todos os elementos da página corretamente", () => {
    render(<InsucessoEntregaPage />);

    const page = screen.getByTestId("page");
    expect(page).toBeInTheDocument();
    expect(page).toHaveAttribute("data-voltar-para", "/");
    expect(page).toHaveAttribute("data-titulo", "Insucesso de Entrega");

    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();

    expect(screen.getByTestId("insucesso-entrega")).toBeInTheDocument();
    expect(screen.getByTestId("insucesso-entrega")).toHaveTextContent(
      "Insucesso Entrega"
    );
  });
});
