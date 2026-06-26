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

  test("Deve aplicar a classe 'point-to-point' quando o tipo de entrega for Ponto a Ponto", () => {
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

    expect(paragraph).toHaveClass("point-to-point");
    expect(paragraph).not.toHaveClass("programa-leve-leite");
  });

  test("Não deve aplicar a classe 'point-to-point' quando o tipo de entrega for Armazém", () => {
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

    expect(paragraph).not.toHaveClass("point-to-point");
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
    expect(paragraph).toHaveClass("point-to-point");
  });
});
