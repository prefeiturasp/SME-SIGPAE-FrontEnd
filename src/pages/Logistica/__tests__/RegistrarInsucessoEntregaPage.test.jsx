import "@testing-library/jest-dom";
import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import RegistrarInsucessoEntregaPage from "../RegistrarInsucessoEntregaPage";

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

jest.mock(
  "components/screens/Logistica/RegistrarInsucessoEntrega",
  () => () => <div data-testid="registrar-insucesso">Registrar Insucesso</div>
);

describe("RegistrarInsucessoEntregaPage", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it("deve renderizar todos os componentes corretamente", () => {
    render(<RegistrarInsucessoEntregaPage />);

    const page = screen.getByTestId("page");
    expect(page).toBeInTheDocument();
    expect(page).toHaveAttribute(
      "data-voltar-para",
      "/logistica/insucesso-entrega"
    );
    expect(page).toHaveAttribute(
      "data-titulo",
      "Registrar Insucesso de Entrega"
    );

    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();

    const registrar = screen.getByTestId("registrar-insucesso");
    expect(registrar).toBeInTheDocument();
    expect(registrar).toHaveTextContent("Registrar Insucesso");
  });
});
