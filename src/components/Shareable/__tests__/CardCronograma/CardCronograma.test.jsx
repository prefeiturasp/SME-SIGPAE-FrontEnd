import "@testing-library/jest-dom";
import { cleanup, render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { CardCronograma } from "../../CardCronograma/CardCronograma";

afterEach(() => cleanup());

describe("CardCronograma", () => {
  const solicitacaoPontoAPonto = {
    text: "Solicitação Ponto a Ponto",
    date: "2024-05-23",
    link: "/mock-link",
    fullText: "Texto completo Ponto a Ponto",
    programa_leve_leite: false,
    categoria: "PERECIVEIS",
    tipo_entrega: "PONTO_A_PONTO",
  };

  const solicitacaoArmazem = {
    text: "Solicitação Armazém",
    date: "2024-05-23",
    link: "/mock-link",
    fullText: "Texto completo Armazém",
    programa_leve_leite: false,
    categoria: "FLV",
    tipo_entrega: "ARMAZEM",
  };

  const solicitacaoPontoAPontoLeveLeite = {
    ...solicitacaoPontoAPonto,
    text: "Solicitação Ponto a Ponto Leve Leite",
    fullText: "Texto completo Ponto a Ponto Leve Leite",
    programa_leve_leite: true,
  };

  const solicitacaoFichaTecnicaFlv = {
    text: "Solicitação Ficha Técnica FLV",
    date: "2024-05-23",
    link: "/mock-link",
    fullText: "Texto completo Ficha Técnica FLV",
    programa_leve_leite: false,
    tipo_entrega: "ARMAZEM",
    eh_ficha_tecnica_flv: true,
  };

  test("Deve aplicar a classe 'ponto-a-ponto' quando o tipo de entrega for Ponto a Ponto", () => {
    render(
      <MemoryRouter>
        <CardCronograma
          cardTitle="Cronograma"
          cardType="tipo-mock"
          solicitations={[solicitacaoPontoAPonto]}
          icon="fa-calendar"
          loading={false}
          href="/mock-href"
          exibirTooltip={false}
        />
      </MemoryRouter>,
    );

    const paragraph = screen
      .getByText("Solicitação Ponto a Ponto")
      .closest("p");

    expect(paragraph).toHaveClass("ponto-a-ponto");
    expect(paragraph).not.toHaveClass("programa-leve-leite");
  });

  test("Não deve aplicar a classe 'ponto-a-ponto' quando o tipo de entrega for Armazém", () => {
    render(
      <MemoryRouter>
        <CardCronograma
          cardTitle="Cronograma"
          cardType="tipo-mock"
          solicitations={[solicitacaoArmazem]}
          icon="fa-calendar"
          loading={false}
          href="/mock-href"
          exibirTooltip={false}
        />
      </MemoryRouter>,
    );

    const paragraph = screen.getByText("Solicitação Armazém").closest("p");

    expect(paragraph).not.toHaveClass("ponto-a-ponto");
    expect(paragraph).not.toHaveClass("programa-leve-leite");
  });

  test("Deve aplicar as classes de Ponto a Ponto e Leve Leite quando ambas as condições forem atendidas", () => {
    render(
      <MemoryRouter>
        <CardCronograma
          cardTitle="Cronograma"
          cardType="tipo-mock"
          solicitations={[solicitacaoPontoAPontoLeveLeite]}
          icon="fa-calendar"
          loading={false}
          href="/mock-href"
          exibirTooltip={false}
        />
      </MemoryRouter>,
    );

    const paragraph = screen
      .getByText("Solicitação Ponto a Ponto Leve Leite")
      .closest("p");

    expect(paragraph).toHaveClass("programa-leve-leite");
    expect(paragraph).toHaveClass("ponto-a-ponto");
  });

  test("Deve aplicar a classe 'eh-ficha-tecnica-flv' quando a solicitação for de ficha técnica FLV", () => {
    render(
      <MemoryRouter>
        <CardCronograma
          cardTitle="Cronograma"
          cardType="tipo-mock"
          solicitations={[solicitacaoFichaTecnicaFlv]}
          icon="fa-calendar"
          loading={false}
          href="/mock-href"
          exibirTooltip={false}
        />
      </MemoryRouter>,
    );

    const paragraph = screen
      .getByText("Solicitação Ficha Técnica FLV")
      .closest("p");

    expect(paragraph).toHaveClass("eh-ficha-tecnica-flv");
    expect(paragraph).not.toHaveClass("ponto-a-ponto");
    expect(paragraph).not.toHaveClass("programa-leve-leite");
  });

  test("Deve renderizar solicitações com tooltip e aplicar a classe de ficha técnica FLV", () => {
    render(
      <MemoryRouter>
        <CardCronograma
          cardTitle="Cronograma"
          cardType="tipo-mock"
          solicitations={[solicitacaoFichaTecnicaFlv]}
          icon="fa-calendar"
          loading={false}
          href="/mock-href"
          exibirTooltip={true}
        />
      </MemoryRouter>,
    );

    const paragraph = screen
      .getByText("Solicitação Ficha Técnica FLV")
      .closest("p");

    expect(paragraph).toHaveClass("eh-ficha-tecnica-flv");
    expect(paragraph).not.toHaveClass("ponto-a-ponto");
    expect(paragraph).not.toHaveClass("programa-leve-leite");

    expect(screen.getByText("2024-05-23")).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: /Solicitação Ficha Técnica FLV/i,
      }),
    ).toHaveAttribute("href", "/mock-link");
  });
});
