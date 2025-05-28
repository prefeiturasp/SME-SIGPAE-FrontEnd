import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { CardListarSolicitacoes } from "../../CardListarSolicitacoes";

jest.mock("helpers/terceirizadas", () => ({
  conferidaClass: () => "conferida-mock",
}));

jest.mock("../../CardStatusDeSolicitacao/helper", () => ({
  caminhoURL: () => "/mock-url",
}));

jest.mock("../../CardListarSolicitacoes/tooltipProdutos", () => () => (
  <div data-testid="tooltip-produto">Tooltip mock</div>
));

jest.mock("../../../../configs/constants", () => ({
  GESTAO_PRODUTO_CARDS: {
    HOMOLOGADOS: "HOMOLOGADOS",
    PRODUTOS_SUSPENSOS: "PRODUTOS_SUSPENSOS",
  },
  RELATORIO: "relatorio",
}));

afterEach(() => cleanup());

describe("CardListarSolicitacoes", () => {
  const solicitacoesMock = [
    {
      uuid: "abc123",
      tipo_doc: "TIPO_X",
      descricao: "Descrição da Solicitação",
      escola_nome: "Escola Modelo",
      date: "2024-05-23 10:30",
    },
  ];

  test("Renderiza corretamente os dados básicos", () => {
    render(
      <MemoryRouter>
        <CardListarSolicitacoes
          titulo="Solicitações Teste"
          tipo="verde"
          solicitacoes={solicitacoesMock}
          icone="fa-file-alt"
        />
      </MemoryRouter>
    );

    expect(screen.getByText("Solicitações Teste")).toBeInTheDocument();

    expect(
      screen.getByText("Descrição da Solicitação / Escola Modelo")
    ).toBeInTheDocument();

    expect(screen.getByText("2024-05-23 10:30")).toBeInTheDocument();
  });

  test("Renderiza TooltipProdutos se o título for HOMOLOGADOS", () => {
    render(
      <MemoryRouter>
        <CardListarSolicitacoes
          titulo="HOMOLOGADOS"
          tipo="azul"
          solicitacoes={solicitacoesMock}
          icone="fa-check"
        />
      </MemoryRouter>
    );

    expect(screen.getByTestId("tooltip-produto")).toBeInTheDocument();
  });
});
