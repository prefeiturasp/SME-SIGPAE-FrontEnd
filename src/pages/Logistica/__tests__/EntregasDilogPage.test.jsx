import "@testing-library/jest-dom";

import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import EntregasDilogPage from "../EntregasDilogPage";

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
  "src/components/screens/Logistica/ConsultaEntregas",
  () => (props) =>
    (
      <div data-testid="consulta-entregas">
        {props.dilog ? "Dilog Ativado" : "Dilog Desativado"}
      </div>
    )
);

describe("EntregasDilogPage", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it("deve renderizar corretamente todos os componentes com as props esperadas", () => {
    render(<EntregasDilogPage />);

    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    expect(screen.getByTestId("consulta-entregas")).toBeInTheDocument();

    expect(screen.getByTestId("page")).toHaveAttribute("data-voltar-para", "/");
    expect(screen.getByTestId("page")).toHaveAttribute(
      "data-titulo",
      "Entregas"
    );

    expect(screen.getByTestId("consulta-entregas")).toHaveTextContent(
      "Dilog Ativado"
    );
  });
});
