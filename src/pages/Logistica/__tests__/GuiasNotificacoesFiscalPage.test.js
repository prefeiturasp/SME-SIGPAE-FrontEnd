import "@testing-library/jest-dom";
import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import GuiasNotificacoesFiscalPage from "../GuiasNotificacoesFiscalPage";

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
  "components/screens/Logistica/GuiasComNotificacoes",
  () =>
    ({ fiscal }) =>
      (
        <div data-testid="guias-notificacoes">
          Guias Notificações {fiscal ? "Fiscal Ativado" : "Fiscal Desativado"}
        </div>
      )
);

describe("GuiasNotificacoesFiscalPage", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it("deve renderizar todos os elementos corretamente com as props esperadas", () => {
    render(<GuiasNotificacoesFiscalPage />);

    const page = screen.getByTestId("page");
    expect(page).toBeInTheDocument();
    expect(page).toHaveAttribute("data-voltar-para", "/");
    expect(page).toHaveAttribute("data-titulo", "Notificações");

    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();

    expect(screen.getByTestId("guias-notificacoes")).toHaveTextContent(
      "Guias Notificações Fiscal Ativado"
    );
  });
});
