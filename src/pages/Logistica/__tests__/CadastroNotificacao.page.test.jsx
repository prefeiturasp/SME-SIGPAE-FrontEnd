import "@testing-library/jest-dom";

import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import CadastroNotificacaoPage from "../CadastroNotificacao.page";

jest.mock("src/components/Shareable/Breadcrumb", () => () => (
  <div data-testid="breadcrumb">Breadcrumb</div>
));

jest.mock(
  "src/components/Shareable/Page/Page",
  () =>
    ({ children, ...props }) =>
      (
        <div data-testid="page" data-titulo={props.titulo}>
          {children}
        </div>
      )
);

jest.mock("src/components/screens/Logistica/CadastroNotificacao", () => () => (
  <div data-testid="cadastro-notificacao">Formulário de Cadastro</div>
));

describe("CadastroNotificacaoPage", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it("deve renderizar todos os componentes corretamente com as props esperadas", () => {
    render(<CadastroNotificacaoPage />);

    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    expect(screen.getByTestId("cadastro-notificacao")).toBeInTheDocument();

    expect(screen.getByTestId("page")).toHaveAttribute(
      "data-titulo",
      "Nova Notificação"
    );
  });
});
