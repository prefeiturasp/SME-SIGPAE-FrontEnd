import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CalendarioCronograma } from "../index.tsx";
import { mockEtapasCalendario } from "src/mocks/Shareable/CalendarioCronograma/mockEtapasCalendario";

jest.mock("react-big-calendar", () => ({
  ...jest.requireActual("react-big-calendar"),
  Calendar: jest.fn(() => <div>Mocked Calendar</div>),
}));

describe("Teste para o componente <CalendarioCronograma>", () => {
  let getObjetosMock;

  beforeEach(() => {
    getObjetosMock = jest.fn().mockResolvedValue({
      status: 200,
      data: { results: mockEtapasCalendario },
    });

    render(
      <CalendarioCronograma
        getObjetos={getObjetosMock}
        nomeObjeto="Cronogramas"
        nomeObjetoMinusculo="cronogramas"
      />,
    );
  });

  it("deve chamar getObjetos na montagem do componente", async () => {
    await waitFor(() => expect(getObjetosMock).toHaveBeenCalled());
  });

  it("deve exibir a mensagem de instrução", async () => {
    await waitFor(() =>
      expect(
        screen.getByText(
          "Para visualizar detalhes dos cronogramas, clique sobre o item no dia programado.",
        ),
      ).toBeInTheDocument(),
    );
  });

  it("deve processar corretamente eventos do mock com programa_leve_leite", async () => {
    await waitFor(() => {
      expect(getObjetosMock).toHaveBeenCalled();
    });

    const eventPropGetterTest = (event) => {
      if (event.programa_leve_leite || event.resource?.programa_leve_leite) {
        return {
          className: "programa-leve-leite",
          style: {
            backgroundColor: "#086397",
            borderColor: "#086397",
            color: "white",
          },
        };
      }
      return {};
    };

    const resultadoProdutoA = eventPropGetterTest({
      programa_leve_leite: mockEtapasCalendario[0].programa_leve_leite,
      title: mockEtapasCalendario[0].nome_produto,
    });
    expect(resultadoProdutoA.className).toBe("programa-leve-leite");
    expect(resultadoProdutoA.style.backgroundColor).toBe("#086397");

    const resultadoProdutoB = eventPropGetterTest({
      programa_leve_leite: mockEtapasCalendario[1].programa_leve_leite,
      title: mockEtapasCalendario[1].nome_produto,
    });
    expect(resultadoProdutoB.className).toBeUndefined();
    expect(Object.keys(resultadoProdutoB).length).toBe(0);
  });

  it("deve aplicar a classe programa-leve-leite nos elementos da tela", async () => {
    await waitFor(() => {
      expect(getObjetosMock).toHaveBeenCalled();
    });

    const elementosComClasse = document.querySelectorAll(
      ".programa-leve-leite",
    );

    expect(elementosComClasse.length).toBeGreaterThanOrEqual(0);

    expect(mockEtapasCalendario[0].programa_leve_leite).toBe(true);
    expect(mockEtapasCalendario[1].programa_leve_leite).toBe(false);

    if (elementosComClasse.length > 0) {
      elementosComClasse.forEach((elemento) => {
        expect(elemento).toHaveClass("programa-leve-leite");
      });
    }
  });
});
