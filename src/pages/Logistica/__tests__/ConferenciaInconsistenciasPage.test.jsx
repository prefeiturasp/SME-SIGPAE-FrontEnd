import "@testing-library/jest-dom";

import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import ConferenciaInconsistenciasPage from "../ConferenciaInconsistenciasPage";

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

jest.mock(
  "src/components/screens/Logistica/ConferenciaInconsistencias",
  () => () =>
    (
      <div data-testid="conferencia-inconsistencias">
        Conteúdo da Inconsistência
      </div>
    )
);

describe("ConferenciaInconsistenciasPage", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it("deve renderizar todos os componentes corretamente com as props esperadas", () => {
    render(<ConferenciaInconsistenciasPage />);

    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    expect(
      screen.getByTestId("conferencia-inconsistencias")
    ).toBeInTheDocument();

    expect(screen.getByTestId("page")).toHaveAttribute("data-voltar-para", "/");
    expect(screen.getByTestId("page")).toHaveAttribute(
      "data-titulo",
      "Conferência de Inconsistência"
    );
  });
});
