import "@testing-library/jest-dom";
import { cleanup, render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { CardCronograma } from "../../CardCronograma/CardCronograma";

afterEach(() => cleanup());

describe("CardCronograma", () => {
  const solicitacaoFLV = {
    text: "Solicitação FLV",
    date: "2024-05-23",
    link: "/mock-link",
    fullText: "Texto completo FLV",
    programa_leve_leite: false,
    categoria: "FLV",
  };

  const solicitacaoNaoFLV = {
    text: "Solicitação Normal",
    date: "2024-05-23",
    link: "/mock-link",
    fullText: "Texto completo Normal",
    programa_leve_leite: false,
    categoria: "OUTRO",
  };

  test("Deve aplicar a classe 'categoria-flv' quando a categoria for FLV", () => {
    render(
      <MemoryRouter>
        <CardCronograma
          cardTitle="Cronograma"
          cardType="tipo-mock"
          solicitations={[solicitacaoFLV]}
          icon="fa-calendar"
          loading={false}
          href="/mock-href"
          exibirTooltip={false}
        />
      </MemoryRouter>,
    );

    const paragraph = screen.getByText("Solicitação FLV").closest("p");
    expect(paragraph).toHaveClass("categoria-flv");
  });

  test("Não deve aplicar a classe 'categoria-flv' quando a categoria não for FLV", () => {
    render(
      <MemoryRouter>
        <CardCronograma
          cardTitle="Cronograma"
          cardType="tipo-mock"
          solicitations={[solicitacaoNaoFLV]}
          icon="fa-calendar"
          loading={false}
          href="/mock-href"
          exibirTooltip={false}
        />
      </MemoryRouter>,
    );

    const paragraph = screen.getByText("Solicitação Normal").closest("p");
    expect(paragraph).not.toHaveClass("categoria-flv");
  });
});
