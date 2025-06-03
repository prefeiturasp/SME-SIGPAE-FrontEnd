import "@testing-library/jest-dom";

import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import AnalisarAssinarPage from "../AnalisarAssinarPage";

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
  "src/components/screens/Logistica/NotificarEmpresa",
  () => (props) =>
    (
      <div data-testid="notificar-empresa">
        {props.fiscal && props.naoEditavel && props.botaoVoltar
          ? "Modo Fiscal Não Editável com Voltar"
          : "Outro Modo"}
      </div>
    )
);

describe("AnalisarAssinarPage", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it("deve renderizar corretamente todos os elementos e props", () => {
    render(<AnalisarAssinarPage />);

    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    expect(screen.getByTestId("notificar-empresa")).toBeInTheDocument();

    expect(screen.getByTestId("page").getAttribute("data-voltar-para")).toBe(
      "/logistica/guias-notificacao-fiscal"
    );
    expect(screen.getByTestId("page").getAttribute("data-titulo")).toBe(
      "Analisar e Assinar"
    );

    expect(screen.getByTestId("notificar-empresa")).toHaveTextContent(
      "Modo Fiscal Não Editável com Voltar"
    );
  });
});
