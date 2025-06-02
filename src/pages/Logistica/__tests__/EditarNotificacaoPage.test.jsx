import "@testing-library/jest-dom";

import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import EditarNotificacaoPage from "../EditarNotificacaoPage";

jest.mock("components/Shareable/Breadcrumb", () => () => (
  <div data-testid="breadcrumb">Breadcrumb</div>
));

jest.mock("components/Shareable/Page/Page", () => ({ children, ...props }) => (
  <div data-testid="page" data-titulo={props.titulo}>
    {children}
  </div>
));

jest.mock("components/screens/Logistica/CadastroNotificacao", () => () => (
  <div data-testid="cadastro-notificacao">Formulário de Edição</div>
));

describe("EditarNotificacaoPage", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it("deve renderizar todos os componentes corretamente com as props corretas", () => {
    render(<EditarNotificacaoPage />);

    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    expect(screen.getByTestId("cadastro-notificacao")).toBeInTheDocument();

    expect(screen.getByTestId("page")).toHaveAttribute(
      "data-titulo",
      "Edição da Notificação"
    );
  });
});
