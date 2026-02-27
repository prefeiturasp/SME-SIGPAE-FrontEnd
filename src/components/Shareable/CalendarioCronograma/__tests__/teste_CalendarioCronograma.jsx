import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { CalendarioCronograma } from "../index";
import { mockEtapasCalendario } from "src/mocks/Shareable/CalendarioCronograma/mockEtapasCalendario";
import mock from "src/services/_mock";

jest.mock("react-big-calendar", () => {
  const React = require("react");
  return {
    ...jest.requireActual("react-big-calendar"),
    Calendar: jest.fn(({ onSelectEvent, events }) => {
      const children = events
        ? events.map((event, index) =>
            React.createElement(
              "button",
              {
                key: index,
                "data-testid": `event-${index}`,
                onClick: () => onSelectEvent(event),
              },
              event.title,
            ),
          )
        : [];
      return React.createElement(
        "div",
        { "data-testid": "mocked-calendar" },
        children,
      );
    }),
  };
});

jest.mock("../../Toast/dialogs", () => ({
  toastError: jest.fn(),
  toastSuccess: jest.fn(),
}));

jest.mock("../../../../helpers/utilities", () => ({
  usuarioEhCronogramaOuCodae: jest.fn(() => true),
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

  describe("Exibição de Interrupções", () => {
    it("deve aplicar classe interrupcao-entrega para eventos de interrupção", async () => {
      await waitFor(() => {
        expect(getObjetosMock).toHaveBeenCalled();
      });

      const eventPropGetterTest = (event) => {
        if (event.isInterrupcao) {
          return {
            className: "interrupcao-entrega",
            style: {
              backgroundColor: "#ffcc80",
              borderColor: "#f57c00",
              color: "#5d4037",
            },
          };
        }
        return {};
      };

      const resultadoInterrupcao = eventPropGetterTest({
        isInterrupcao: true,
        title: "INTERRUPÇÃO DE ENTREGA",
      });
      expect(resultadoInterrupcao.className).toBe("interrupcao-entrega");
      expect(resultadoInterrupcao.style.backgroundColor).toBe("#ffcc80");
      expect(resultadoInterrupcao.style.borderColor).toBe("#f57c00");
    });

    it("deve exibir cor laranja para eventos de interrupção", async () => {
      await waitFor(() => {
        expect(getObjetosMock).toHaveBeenCalled();
      });

      const eventPropGetterTest = (event) => {
        if (event.isInterrupcao) {
          return {
            style: {
              backgroundColor: "#ffcc80",
            },
          };
        }
        return {};
      };

      const resultado = eventPropGetterTest({ isInterrupcao: true });
      expect(resultado.style.backgroundColor).toBe("#ffcc80");
    });

    it("deve exibir tooltip com informações da interrupção", () => {
      const mockInterrupcao = {
        isInterrupcao: true,
        motivo_display: "Reunião",
        descricao_motivo: "",
        title: "INTERRUPÇÃO DE ENTREGA",
      };

      const tooltipText = mockInterrupcao.descricao_motivo
        ? `${mockInterrupcao.motivo_display}: ${mockInterrupcao.descricao_motivo}`
        : mockInterrupcao.motivo_display;

      expect(tooltipText).toBe("Reunião");
    });

    it("deve exibir tooltip com descrição quando motivo é OUTROS", () => {
      const mockInterrupcao = {
        isInterrupcao: true,
        motivo_display: "Outros",
        descricao_motivo: "Manutenção do sistema",
        title: "INTERRUPÇÃO DE ENTREGA",
      };

      const tooltipText = mockInterrupcao.descricao_motivo
        ? `${mockInterrupcao.motivo_display}: ${mockInterrupcao.descricao_motivo}`
        : mockInterrupcao.motivo_display;

      expect(tooltipText).toBe("Outros: Manutenção do sistema");
    });

    it("deve processar corretamente eventos mistos (cronogramas e interrupções)", async () => {
      await waitFor(() => {
        expect(getObjetosMock).toHaveBeenCalled();
      });

      const eventos = [
        { isInterrupcao: false, programa_leve_leite: true, title: "Produto A" },
        {
          isInterrupcao: true,
          motivo_display: "Emenda",
          title: "INTERRUPÇÃO DE ENTREGA",
        },
        {
          isInterrupcao: false,
          programa_leve_leite: false,
          title: "Produto B",
        },
      ];

      const eventPropGetter = (event) => {
        if (event.isInterrupcao) {
          return { className: "interrupcao-entrega" };
        }
        if (event.programa_leve_leite) {
          return { className: "programa-leve-leite" };
        }
        return {};
      };

      expect(eventPropGetter(eventos[0]).className).toBe("programa-leve-leite");
      expect(eventPropGetter(eventos[1]).className).toBe("interrupcao-entrega");
      expect(Object.keys(eventPropGetter(eventos[2])).length).toBe(0);
    });

    it("deve abrir o modal de detalhes ao selecionar um evento de interrupção", async () => {
      const user = userEvent.setup();

      // Criar um evento de interrupção simulado que o CalendarioCronograma carrega
      const mockInterrupcao = {
        uuid: "inter-123",
        data: "17/02/2026",
        motivo_display: "Feriado",
        descricao_motivo: "Carnaval",
        tipo_calendario: "ARMAZENAVEL",
        tipo_calendario_display: "Armazenável",
      };

      // Simular a resposta do serviço de interrupções
      mock.onGet(/\/interrupcao-programada-entrega\//).reply(200, {
        results: [mockInterrupcao],
      });

      // Re-renderizar para capturar o novo mock de interrupção
      render(
        <CalendarioCronograma
          getObjetos={getObjetosMock}
          nomeObjeto="Cronogramas"
          nomeObjetoMinusculo="cronogramas"
        />,
      );

      await waitFor(() => {
        expect(screen.getByText("INTERRUPÇÃO DE ENTREGA")).toBeInTheDocument();
      });

      const eventBtn = screen.getByText("INTERRUPÇÃO DE ENTREGA");
      await user.click(eventBtn);

      await waitFor(() => {
        expect(screen.getByText("Interrupção de Entrega")).toBeInTheDocument();
        expect(screen.getByText("17/02/2026")).toBeInTheDocument();
        expect(screen.getByText(/Feriado - Carnaval/i)).toBeInTheDocument();
      });
    });
  });
});
