import "@testing-library/jest-dom";
import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import EntregasDrePage from "../EntregasDrePage";

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
        {props.dre ? "DRE Ativado" : "DRE Desativado"}
      </div>
    )
);

describe("EntregasDrePage", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it("deve renderizar todos os elementos esperados com as props corretas", () => {
    render(<EntregasDrePage />);

    const page = screen.getByTestId("page");
    expect(page).toBeInTheDocument();
    expect(page).toHaveAttribute("data-voltar-para", "/");
    expect(page).toHaveAttribute("data-titulo", "Entregas");

    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();

    const entregas = screen.getByTestId("consulta-entregas");
    expect(entregas).toBeInTheDocument();
    expect(entregas).toHaveTextContent("DRE Ativado");
  });
});
