import "@testing-library/jest-dom";

import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import ReposicaoResumoFinalPage from "../ReposicaoResumoFinalPage";

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
  () =>
    ({ reposicao }) =>
      (
        <div data-testid="conferencia-resumo-final">
          {reposicao ? "Reposição Ativada" : "Reposição Desativada"}
        </div>
      )
);

describe("ReposicaoResumoFinalPage", () => {
  const originalLocation = window.location;

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
    window.location = originalLocation;
  });

  it("deve renderizar corretamente com uuid na URL", () => {
    delete window.location;
    window.location = { search: "?uuid=abc123" };

    render(<ReposicaoResumoFinalPage />);

    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    expect(screen.getByTestId("conferencia-resumo-final")).toBeInTheDocument();

    expect(screen.getByTestId("page")).toHaveAttribute(
      "data-voltar-para",
      "/logistica/conferir-entrega"
    );
    expect(screen.getByTestId("page")).toHaveAttribute(
      "data-titulo",
      "Reposição de alimentos faltantes"
    );

    expect(screen.getByTestId("conferencia-resumo-final")).toHaveTextContent(
      "Reposição Ativada"
    );
  });

  it("deve renderizar corretamente mesmo sem uuid na URL", () => {
    delete window.location;
    window.location = { search: "" };

    render(<ReposicaoResumoFinalPage />);

    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    expect(screen.getByTestId("conferencia-resumo-final")).toHaveTextContent(
      "Reposição Ativada"
    );

    expect(screen.getByTestId("page")).toHaveAttribute(
      "data-voltar-para",
      "/logistica/conferir-entrega"
    );
    expect(screen.getByTestId("page")).toHaveAttribute(
      "data-titulo",
      "Reposição de alimentos faltantes"
    );
  });
});
