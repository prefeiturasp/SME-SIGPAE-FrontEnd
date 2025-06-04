import "@testing-library/jest-dom";

import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import ConferenciaDeGuiaPage from "../ConferenciaDeGuiaPage";

jest.mock("src/components/Shareable/Breadcrumb", () => () => (
  <div data-testid="breadcrumb">Breadcrumb</div>
));

jest.mock(
  "src/components/Shareable/Page/Page",
  () =>
    ({ children, ...props }) =>
      (
        <div
          data-testid="page"
          data-voltar-para={props.voltarPara}
          data-titulo={props.titulo}
        >
          {children}
        </div>
      )
);

jest.mock("src/components/screens/Logistica/ConferenciaDeGuia", () => () => (
  <div data-testid="conferencia-de-guia">Conteúdo da Guia</div>
));

describe("ConferenciaDeGuiaPage", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it("deve renderizar todos os componentes corretamente com as props esperadas", () => {
    render(<ConferenciaDeGuiaPage />);

    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    expect(screen.getByTestId("conferencia-de-guia")).toBeInTheDocument();

    expect(screen.getByTestId("page")).toHaveAttribute(
      "data-voltar-para",
      "/logistica/conferir-entrega"
    );
    expect(screen.getByTestId("page")).toHaveAttribute(
      "data-titulo",
      "Conferência da Guia de Remessa"
    );
  });
});
