import "@testing-library/jest-dom";

import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import ConsultaRequisicaoEntregaDilogPage from "../ConsultaRequisicaoEntregaDilog";

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
  "src/components/screens/Logistica/ConsultaRequisicaoEntregaDilog",
  () => () =>
    <div data-testid="consulta-requisicao">Consulta de Requisição</div>
);

describe("ConsultaRequisicaoEntregaDilogPage", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it("deve renderizar todos os componentes corretamente com as props esperadas", () => {
    render(<ConsultaRequisicaoEntregaDilogPage />);

    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    expect(screen.getByTestId("consulta-requisicao")).toBeInTheDocument();

    expect(screen.getByTestId("page")).toHaveAttribute("data-voltar-para", "/");
    expect(screen.getByTestId("page")).toHaveAttribute(
      "data-titulo",
      "Requisição de Entrega"
    );
  });
});
