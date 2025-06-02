import "@testing-library/jest-dom";
import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import NotificarEmpresaPage from "../NotificarEmpresaPage";

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

jest.mock("components/screens/Logistica/NotificarEmpresa", () => () => (
  <div data-testid="notificar-empresa">Notificar Empresa</div>
));

describe("NotificarEmpresaPage", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it("deve renderizar todos os elementos da página corretamente", () => {
    render(<NotificarEmpresaPage />);

    const page = screen.getByTestId("page");
    expect(page).toBeInTheDocument();
    expect(page).toHaveAttribute(
      "data-voltar-para",
      "/logistica/guias-notificacao"
    );
    expect(page).toHaveAttribute("data-titulo", "Notificar Empresa");

    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();

    expect(screen.getByTestId("notificar-empresa")).toBeInTheDocument();
    expect(screen.getByTestId("notificar-empresa")).toHaveTextContent(
      "Notificar Empresa"
    );
  });
});
