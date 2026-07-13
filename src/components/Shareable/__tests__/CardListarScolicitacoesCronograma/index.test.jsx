import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import CardListarSolicitacoesCronograma from "../../CardListarSolicitacoesCronograma";

afterEach(cleanup);

describe("CardListarSolicitacoesCronograma", () => {
  const solicitacoesMock = [
    {
      texto: "Solicitação 1",
      textoCompleto: "Solicitação completa 1",
      link: "/solicitacao-1",
      data: "2024-05-23 14:00",
    },
  ];

  test("Renderiza corretamente os dados básicos sem tooltip", () => {
    render(
      <MemoryRouter>
        <CardListarSolicitacoesCronograma
          titulo="Cronograma"
          tipo="azul"
          icone="fa-clock"
          solicitacoes={solicitacoesMock}
          exibirTooltip={false}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText("Cronograma")).toBeInTheDocument();

    expect(screen.getByText("Solicitação 1")).toBeInTheDocument();

    expect(screen.getByText("2024-05-23 14:00")).toBeInTheDocument();

    expect(screen.getByRole("link")).toHaveAttribute("href", "/solicitacao-1");
  });

  test("Renderiza tooltip quando exibirTooltip é true", () => {
    render(
      <MemoryRouter>
        <CardListarSolicitacoesCronograma
          titulo="Cronograma"
          tipo="verde"
          icone="fa-clock"
          solicitacoes={solicitacoesMock}
          exibirTooltip={true}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText("Solicitação 1")).toBeInTheDocument();

    const tooltipSpan = screen.getByText("Solicitação 1");
    expect(tooltipSpan.closest("div")?.getAttribute("title")).toBeNull();
  });
  test("Aplica classe verde quando solicitação é de ficha técnica FLV", () => {
    const solicitacoesFlvMock = [
      {
        ...solicitacoesMock[0],
        eh_ficha_tecnica_flv: true,
      },
    ];

    render(
      <MemoryRouter>
        <CardListarSolicitacoesCronograma
          titulo="Cronograma"
          tipo="azul"
          icone="fa-clock"
          solicitacoes={solicitacoesFlvMock}
          exibirTooltip={false}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText("Solicitação 1")).toHaveClass(
      "categoria-na-cor-verde",
    );

    expect(screen.getByText("2024-05-23 14:00")).toHaveClass(
      "categoria-na-cor-verde",
    );
  });
});
