import "@testing-library/jest-dom";

import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import DisponibilizacaoDeSolicitacoesPage from "../DisponibilizacaoDeSolicitacoesPage";

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
  "src/components/screens/Logistica/DisponibilizacaoDeSolicitacoes",
  () => ({
    DisponibilizacaoDeSolicitacoes: () => (
      <div data-testid="disponibilizacao-solicitacoes">
        Conteúdo da Disponibilização
      </div>
    ),
  })
);

describe("DisponibilizacaoDeSolicitacoesPage", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it("deve renderizar corretamente todos os componentes com as props corretas", () => {
    render(<DisponibilizacaoDeSolicitacoesPage />);

    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    expect(
      screen.getByTestId("disponibilizacao-solicitacoes")
    ).toBeInTheDocument();

    expect(screen.getByTestId("page")).toHaveAttribute("data-voltar-para", "/");
    expect(screen.getByTestId("page")).toHaveAttribute(
      "data-titulo",
      "Disponibilização de Solicitações"
    );
  });
});
