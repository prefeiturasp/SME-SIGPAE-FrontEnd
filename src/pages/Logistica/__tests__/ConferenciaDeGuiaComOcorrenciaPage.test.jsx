import "@testing-library/jest-dom";

import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import ConferenciaDeGuiaComOcorrenciaPage from "../ConferenciaDeGuiaComOcorrenciaPage";

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
  "components/screens/Logistica/ConferenciaDeGuiaComOcorrencia",
  () => () =>
    <div data-testid="conferencia-de-guia">Conteúdo da Conferência</div>
);

describe("ConferenciaDeGuiaComOcorrenciaPage", () => {
  const originalLocation = window.location;

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
    window.location = originalLocation;
  });

  it("deve renderizar corretamente com uuid na URL", () => {
    delete window.location;
    window.location = { search: "?uuid=123" };

    render(<ConferenciaDeGuiaComOcorrenciaPage />);

    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    expect(screen.getByTestId("conferencia-de-guia")).toBeInTheDocument();

    expect(screen.getByTestId("page").getAttribute("data-voltar-para")).toBe(
      "/logistica/conferir-entrega"
    );
    expect(screen.getByTestId("page").getAttribute("data-titulo")).toBe(
      "Conferência da guia de remessa"
    );
  });

  it("deve renderizar corretamente mesmo sem uuid na URL", () => {
    delete window.location;
    window.location = { search: "" };

    render(<ConferenciaDeGuiaComOcorrenciaPage />);

    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    expect(screen.getByTestId("conferencia-de-guia")).toBeInTheDocument();

    expect(screen.getByTestId("page").getAttribute("data-voltar-para")).toBe(
      "/logistica/conferir-entrega"
    );
    expect(screen.getByTestId("page").getAttribute("data-titulo")).toBe(
      "Conferência da guia de remessa"
    );
  });
});
