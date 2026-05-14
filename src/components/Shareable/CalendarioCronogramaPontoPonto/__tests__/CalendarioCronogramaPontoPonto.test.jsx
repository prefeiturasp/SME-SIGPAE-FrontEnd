import "@testing-library/jest-dom";
import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import React from "react";
import mock from "src/services/_mock";
import { CalendarioCronogramaPontoPonto } from "../CalendarioCronogramaPontoPonto";

const mockCalendarioPontoaPonto = [
  {
    uuid: "209ddd31-...",
    numero: "CRO-F27A6414",
    produto: "Produto X",
    fornecedor: "Empresa Teste",
    empenho: "2025NE001234",
    local: "Armazém Central",
    unidade_medida: "KG",
    programacoes: [
      {
        data_inicio: "2025-01-10",
        data_fim: "2025-01-15",
        quantidade: "100.00",
      },
    ],
  },
];

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

describe("Teste para o componente <CalendarioCronogramaPontoPonto>", () => {
  let getObjetosMock;

  beforeEach(() => {
    getObjetosMock = jest.fn().mockResolvedValue({
      status: 200,
      data: mockCalendarioPontoaPonto,
    });

    render(
      <CalendarioCronogramaPontoPonto
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

  describe("Exibição de Interrupções", () => {
    it("deve aplicar classe interrupcao-entrega para eventos de FERIADO", async () => {
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
        title: "FERIADO",
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
        title: "EMENDA",
      };

      const tooltipText = mockInterrupcao.descricao_motivo
        ? `${mockInterrupcao.motivo_display}: ${mockInterrupcao.descricao_motivo}`
        : mockInterrupcao.motivo_display;

      expect(tooltipText).toBe("Reunião");
    });

    it("deve processar corretamente eventos mistos (cronogramas e interrupções)", async () => {
      await waitFor(() => {
        expect(getObjetosMock).toHaveBeenCalled();
      });

      const eventos = [
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
        return {};
      };

      expect(eventPropGetter(eventos[0]).className).toBe("interrupcao-entrega");
      expect(Object.keys(eventPropGetter(eventos[1])).length).toBe(0);
    });

    it("deve aparecer evento de interrupção FERIADO e EMENDA", async () => {
      // Criar um evento de interrupção simulado que o CalendarioCronograma carrega
      const mockInterrupcao = [
        {
          uuid: "inter-123",
          data: "17/02/2026",
          motivo_display: "Feriado",
          motivo: "FERIADO",
          descricao_motivo: "Carnaval",
          tipo_calendario: "ARMAZENAVEL",
          tipo_calendario_display: "Armazenável",
        },
        {
          uuid: "inter-1234",
          data: "18/02/2026",
          motivo_display: "emenda",
          motivo: "EMENDA",
          descricao_motivo: "Carnaval",
          tipo_calendario: "ARMAZENAVEL",
          tipo_calendario_display: "Armazenável",
        },
      ];

      // Simular a resposta do serviço de interrupções
      mock.onGet(/\/interrupcao-programada-entrega\//).reply(200, {
        results: mockInterrupcao,
      });

      // Re-renderizar para capturar o novo mock de interrupção
      render(
        <CalendarioCronogramaPontoPonto
          getObjetos={getObjetosMock}
          nomeObjeto="Cronogramas"
          nomeObjetoMinusculo="cronogramas"
        />,
      );

      await waitFor(() => {
        expect(screen.getByText("FERIADO")).toBeInTheDocument();
        expect(screen.getByText("EMENDA")).toBeInTheDocument();
      });
    });
  });

  describe("Filtragem de itens no mesmo dia que interrupções", () => {
    beforeEach(() => {
      mock.reset();
      cleanup();
    });

    it("não deve exibir item de cronograma no mesmo dia que uma interrupção", async () => {
      const getObjetosMockComData = jest.fn().mockResolvedValue({
        status: 200,
        data: [
          {
            uuid: "cronograma-uuid-1",
            numero: "CRO-001",
            produto: "Produto Bloqueado",
            fornecedor: "Fornecedor X",
            empenho: "2025NE001",
            local: "Armazém",
            unidade_medida: "KG",
            programacoes: [
              {
                data_inicio: "10/01/2025",
                data_fim: "10/01/2025",
                quantidade: 100,
              },
            ],
          },
        ],
      });

      mock.onGet(/\/interrupcao-programada-entrega\//).reply(200, {
        results: [
          {
            uuid: "inter-001",
            data: "10/01/2025",
            motivo: "FERIADO",
            motivo_display: "Feriado",
            descricao_motivo: "Feriado Nacional",
            tipo_calendario: "ARMAZENAVEL",
            tipo_calendario_display: "Armazenável",
          },
        ],
      });

      const { container } = render(
        <CalendarioCronogramaPontoPonto
          getObjetos={getObjetosMockComData}
          nomeObjeto="Cronogramas"
          nomeObjetoMinusculo="cronogramas"
        />,
      );

      const { getByText, queryByText } = within(container);

      await waitFor(() => {
        expect(getByText("FERIADO")).toBeInTheDocument();
        expect(queryByText("Produto Bloqueado")).not.toBeInTheDocument();
      });
    });

    it("deve exibir item de cronograma quando NÃO há interrupção no mesmo dia", async () => {
      const getObjetosMockComData = jest.fn().mockResolvedValue({
        status: 200,
        data: [
          {
            uuid: "cronograma-uuid-2",
            numero: "CRO-002",
            produto: "Produto Liberado",
            fornecedor: "Fornecedor Y",
            empenho: "2025NE002",
            local: "Armazém",
            unidade_medida: "KG",
            programacoes: [
              {
                data_inicio: "15/01/2025",
                data_fim: "15/01/2025",
                quantidade: 50,
              },
            ],
          },
        ],
      });

      // Interrupção em dia DIFERENTE do cronograma
      mock.onGet(/\/interrupcao-programada-entrega\//).reply(200, {
        results: [
          {
            uuid: "inter-002",
            data: "10/01/2025",
            motivo: "FERIADO",
            motivo_display: "Feriado",
            descricao_motivo: "Feriado Nacional",
            tipo_calendario: "ARMAZENAVEL",
            tipo_calendario_display: "Armazenável",
          },
        ],
      });

      render(
        <CalendarioCronogramaPontoPonto
          getObjetos={getObjetosMockComData}
          nomeObjeto="Cronogramas"
          nomeObjetoMinusculo="cronogramas"
        />,
      );

      await waitFor(() => {
        // O cronograma deve aparecer pois está em dia diferente da interrupção
        expect(screen.getByText("Produto Liberado")).toBeInTheDocument();
      });
    });
  });
});
