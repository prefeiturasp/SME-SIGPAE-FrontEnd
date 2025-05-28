import "@testing-library/jest-dom";

import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import ConferenciaDeGuiaResumoFinalPage from "../ConferenciaDeGuiaResumoFinalPage";

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
  "components/screens/Logistica/ConferenciaDeGuiaResumoFinal",
  () => () => <div data-testid="conferencia-resumo-final">Resumo Final</div>
);

describe("ConferenciaDeGuiaResumoFinalPage", () => {
  const originalLocation = window.location;

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
    window.location = originalLocation;
  });

  it("deve renderizar corretamente com uuid na URL", () => {
    delete window.location;
    window.location = { search: "?uuid=abc123" };

    render(<ConferenciaDeGuiaResumoFinalPage />);

    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    expect(screen.getByTestId("conferencia-resumo-final")).toBeInTheDocument();

    expect(screen.getByTestId("page").getAttribute("data-voltar-para")).toBe(
      "/logistica/conferir-entrega"
    );
    expect(screen.getByTestId("page").getAttribute("data-titulo")).toBe(
      "Conferência individual de itens"
    );
  });

  it("deve renderizar corretamente mesmo sem uuid na URL", () => {
    delete window.location;
    window.location = { search: "" };

    render(<ConferenciaDeGuiaResumoFinalPage />);

    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    expect(screen.getByTestId("conferencia-resumo-final")).toBeInTheDocument();

    expect(screen.getByTestId("page").getAttribute("data-voltar-para")).toBe(
      "/logistica/conferir-entrega"
    );
    expect(screen.getByTestId("page").getAttribute("data-titulo")).toBe(
      "Conferência individual de itens"
    );
  });
});
