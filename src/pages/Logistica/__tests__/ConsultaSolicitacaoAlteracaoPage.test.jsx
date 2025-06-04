import "@testing-library/jest-dom";

import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import ConsultaSolicitacaoAlteracaoPage from "../ConsultaSolicitacaoAlteracaoPage";

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
  "src/components/screens/Logistica/ConsultaSolicitacaoAlteracao",
  () => () =>
    <div data-testid="consulta-solicitacao-alteracao">Conteúdo da Consulta</div>
);

describe("ConsultaSolicitacaoAlteracaoPage", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it("deve renderizar todos os componentes corretamente com as props esperadas", () => {
    render(<ConsultaSolicitacaoAlteracaoPage />);

    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    expect(
      screen.getByTestId("consulta-solicitacao-alteracao")
    ).toBeInTheDocument();

    expect(screen.getByTestId("page")).toHaveAttribute("data-voltar-para", "/");
    expect(screen.getByTestId("page")).toHaveAttribute(
      "data-titulo",
      "Solicitação de Alteração"
    );
  });
});
