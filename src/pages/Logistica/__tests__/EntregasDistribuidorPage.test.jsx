import "@testing-library/jest-dom";
import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import EntregasDistribuidorPage from "../EntregasDistribuidorPage";

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

jest.mock("components/screens/Logistica/ConsultaEntregas", () => (props) => (
  <div data-testid="consulta-entregas">
    {props.distribuidor ? "Distribuidor Ativado" : "Distribuidor Desativado"}
  </div>
));

describe("EntregasDistribuidorPage", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it("deve renderizar corretamente todos os elementos e props esperadas", () => {
    render(<EntregasDistribuidorPage />);

    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    expect(screen.getByTestId("consulta-entregas")).toBeInTheDocument();

    expect(screen.getByTestId("page")).toHaveAttribute("data-voltar-para", "/");
    expect(screen.getByTestId("page")).toHaveAttribute(
      "data-titulo",
      "Entregas"
    );

    expect(screen.getByTestId("consulta-entregas")).toHaveTextContent(
      "Distribuidor Ativado"
    );
  });
});
