import "@testing-library/jest-dom";
import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import ReposicaoDeGuiaPage from "../ReposicaoDeGuiaPage";

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

jest.mock("src/components/screens/Logistica/ReposicaoDeGuia", () => () => (
  <div data-testid="reposicao-guia">Reposição de Guia</div>
));

describe("ReposicaoDeGuiaPage", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it("deve renderizar a página com todos os componentes", () => {
    render(<ReposicaoDeGuiaPage />);

    const page = screen.getByTestId("page");
    expect(page).toBeInTheDocument();
    expect(page).toHaveAttribute(
      "data-voltar-para",
      "/logistica/conferir-entrega"
    );
    expect(page).toHaveAttribute(
      "data-titulo",
      "Reposição de alimentos faltantes"
    );

    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();

    const reposicao = screen.getByTestId("reposicao-guia");
    expect(reposicao).toBeInTheDocument();
    expect(reposicao).toHaveTextContent("Reposição de Guia");
  });
});
