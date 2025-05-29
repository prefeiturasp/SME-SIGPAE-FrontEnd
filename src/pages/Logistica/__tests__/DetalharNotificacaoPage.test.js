import "@testing-library/jest-dom";

import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import DetalharNotificacaoPage from "../DetalharNotificacaoPage";

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

jest.mock("components/screens/Logistica/NotificarEmpresa", () => (props) => (
  <div data-testid="notificar-empresa">
    {props.naoEditavel && props.botaoVoltar && props.voltarPara
      ? `Modo Visualização com Voltar para ${props.voltarPara}`
      : "Outro Modo"}
  </div>
));

describe("DetalharNotificacaoPage", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it("deve renderizar todos os componentes com as props corretas", () => {
    render(<DetalharNotificacaoPage />);

    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    expect(screen.getByTestId("notificar-empresa")).toBeInTheDocument();

    expect(screen.getByTestId("page")).toHaveAttribute(
      "data-voltar-para",
      "/logistica/guias-notificacao"
    );
    expect(screen.getByTestId("page")).toHaveAttribute(
      "data-titulo",
      "Detalhar Notificação"
    );

    expect(screen.getByTestId("notificar-empresa")).toHaveTextContent(
      "Modo Visualização com Voltar para /logistica/guias-notificacao"
    );
  });
});
