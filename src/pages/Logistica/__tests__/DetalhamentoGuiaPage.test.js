import "@testing-library/jest-dom";

import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import DetalhamentoGuiaPage from "../DetalhamentoGuiaPage";

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

jest.mock("components/screens/Logistica/DetalhamentoGuia", () => () => (
  <div data-testid="detalhamento-guia">Conteúdo Detalhamento</div>
));

describe("DetalhamentoGuiaPage", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it("deve renderizar corretamente todos os componentes com as props esperadas", () => {
    render(<DetalhamentoGuiaPage />);

    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    expect(screen.getByTestId("detalhamento-guia")).toBeInTheDocument();

    expect(screen.getByTestId("page")).toHaveAttribute(
      "data-voltar-para",
      "/logistica/conferir-entrega"
    );
    expect(screen.getByTestId("page")).toHaveAttribute(
      "data-titulo",
      "Detalhamento da Guia de Remessa"
    );
  });
});
