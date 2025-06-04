import "@testing-library/jest-dom";
import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import GuiasNotificacoesPage from "../GuiasNotificacoesPage";

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

jest.mock("src/components/screens/Logistica/GuiasComNotificacoes", () => () => (
  <div data-testid="guias-notificacoes">Guias Notificações</div>
));

describe("GuiasNotificacoesPage", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it("deve renderizar todos os elementos corretamente com as props esperadas", () => {
    render(<GuiasNotificacoesPage />);

    const page = screen.getByTestId("page");
    expect(page).toBeInTheDocument();
    expect(page).toHaveAttribute("data-voltar-para", "/");
    expect(page).toHaveAttribute("data-titulo", "Guias com Notificações");

    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();

    expect(screen.getByTestId("guias-notificacoes")).toHaveTextContent(
      "Guias Notificações"
    );
  });
});
