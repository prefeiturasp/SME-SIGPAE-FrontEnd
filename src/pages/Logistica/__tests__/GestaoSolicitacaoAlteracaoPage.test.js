import "@testing-library/jest-dom";
import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import GestaoSolicitacaoAlteracaoPage from "../GestaoSolicitacaoAlteracaoPage";

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
  "components/screens/Logistica/GestaoSolicitacaoAlteracao",
  () => () =>
    <div data-testid="gestao-solicitacao-alteracao">Gestão Solicitação</div>
);

describe("GestaoSolicitacaoAlteracaoPage", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it("deve renderizar todos os elementos corretamente com as props esperadas", () => {
    render(<GestaoSolicitacaoAlteracaoPage />);

    const page = screen.getByTestId("page");
    expect(page).toBeInTheDocument();
    expect(page).toHaveAttribute("data-voltar-para", "/");
    expect(page).toHaveAttribute("data-titulo", "Alteração da Requisição");

    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();

    expect(
      screen.getByTestId("gestao-solicitacao-alteracao")
    ).toBeInTheDocument();
  });
});
