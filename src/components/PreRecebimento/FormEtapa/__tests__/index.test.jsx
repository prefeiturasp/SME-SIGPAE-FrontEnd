import React from "react";
import {
  render,
  screen,
  act,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import FormEtapa from "../index";
import mock from "src/services/_mock";
import { Form } from "react-final-form";
import { mockGetOpcoesEtapas } from "src/mocks/cronograma.service/mockGetOpcoesEtapas";
import { mockMeusDadosDilogQualidade } from "src/mocks/meusDados/dilog-qualidade";
import { MemoryRouter } from "react-router-dom";
import { MeusDadosContext } from "src/context/MeusDadosContext";

jest.mock("src/components/Shareable/DatePicker", () => ({
  InputComData: ({ input, placeholder, showMonthYearPicker }) => (
    <input
      data-testid={input.name}
      placeholder={placeholder}
      value={input.value}
      onChange={(e) => input.onChange(e.target.value)}
      data-monthly={showMonthYearPicker ? "true" : "false"}
    />
  ),
}));

describe("Testes no componente de FormEtapa - PreRecebimento", () => {
  const setEtapas = jest.fn();

  const setParte = (id, valor) => {
    const campo = screen.getByTestId(id);
    const select = campo.querySelector("select");
    fireEvent.change(select, {
      target: { value: valor },
    });
  };

  const setInput = (id, valor) => {
    const campo = screen.getByTestId(id);
    fireEvent.change(campo, {
      target: { value: valor },
    });
  };

  const setAutoComplete = (id, valor) => {
    const campo = screen.getByTestId(id);
    const input = campo.querySelector("input");
    fireEvent.focus(input);
    fireEvent.change(input, {
      target: { value: valor },
    });
  };

  const setData = async (placeholder, valor) => {
    const input = screen.getByTestId(placeholder);
    fireEvent.change(input, { target: { value: valor } });
  };

  describe("Fluxo Comum (Não FLV)", () => {
    const props = {
      values: {
        quantidade_total: "1.000,00",
        quantidade_0: "500,00",
        parte_0: "A",
        etapa_0: "Etapa 1",
      },
      errors: {},
      etapas: mockGetOpcoesEtapas,
      setEtapas: setEtapas,
      restante: 10,
      duplicados: [],
      ehAlteracao: false,
      unidadeMedida: "UN",
    };

    beforeEach(async () => {
      mock
        .onGet("/interrupcao-programada-entrega/datas-bloqueadas-armazenavel/")
        .reply(200, {
          results: ["2025-01-01", "2025-12-25"],
        });
      mock.onGet("/cronogramas/opcoes-etapas/").reply(200, mockGetOpcoesEtapas);

      await act(async () => {
        render(
          <MemoryRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <MeusDadosContext.Provider
              value={{
                meusDados: mockMeusDadosDilogQualidade,
                setMeusDados: jest.fn(),
              }}
            >
              <Form
                onSubmit={() => {}}
                initialValues={props.values}
                render={() => <FormEtapa {...props} />}
              />
            </MeusDadosContext.Provider>
          </MemoryRouter>,
        );
      });
    });

    it("deve renderizar os campos corretamente", async () => {
      expect(screen.getAllByText("Total de Embalagens")).toHaveLength(2);
      expect(screen.getAllByText("Etapa")).toHaveLength(2);
      expect(screen.getAllByText("Parte")).toHaveLength(2);
    });

    it("deve clicar no botao 'Remover Etapa' e alterar o state de etapas", async () => {
      const botao = screen.getByTestId("remover_etapa_1");
      fireEvent.click(botao);

      const etapasNovo = mockGetOpcoesEtapas;
      etapasNovo.splice(1, 1);

      await waitFor(() => {
        expect(setEtapas).toHaveBeenCalledWith(etapasNovo);
      });
    });

    it("deve preencher os campos necessários e clicar em Adicionar Etapa", async () => {
      setAutoComplete("etapa_0", "Etapa 1");
      setParte("parte_0", "Parte 1");
      setData("data_programada_0", "01/09/2025");
      setInput("quantidade_0", "50");
      setInput("total_embalagens_0", "10");

      const botao = screen.getByTestId("adicionar-etapa");
      await waitFor(() => expect(botao).not.toBeDisabled());

      fireEvent.click(botao);
      await waitFor(() => expect(setEtapas).toHaveBeenCalled());
    });
  });

  describe("Testes do fluxo Ponto a Ponto no FormEtapa", () => {
    const setEtapasPontoAPonto = jest.fn();

    const props = {
      values: {
        quantidade_total: "1.000,00",
        quantidade_0: "500,00",
        parte_0: "Parte 1",
        etapa_0: "Etapa 1",
      },
      errors: {},
      etapas: [{}],
      setEtapas: setEtapasPontoAPonto,
      restante: 10,
      duplicados: [],
      ehAlteracao: false,
      unidadeMedida: { nome: "UN" },
      flv_ponto_a_ponto: true,
    };

    beforeEach(async () => {
      mock
        .onGet("/interrupcao-programada-entrega/datas-bloqueadas-armazenavel/")
        .reply(200, { results: [] });
      mock.onGet("/cronogramas/opcoes-etapas/").reply(200, mockGetOpcoesEtapas);

      await act(async () => {
        render(
          <MemoryRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <MeusDadosContext.Provider
              value={{
                meusDados: mockMeusDadosDilogQualidade,
                setMeusDados: jest.fn(),
              }}
            >
              <Form
                onSubmit={() => {}}
                initialValues={props.values}
                render={() => <FormEtapa {...props} />}
              />
            </MeusDadosContext.Provider>
          </MemoryRouter>,
        );
      });
    });

    it("deve ocultar campos de empenho e total de embalagens no modo Ponto a Ponto", async () => {
      expect(screen.queryByText("Nº do Empenho")).not.toBeInTheDocument();
      expect(
        screen.queryByText("Qtde. Total do Empenho"),
      ).not.toBeInTheDocument();
      expect(screen.queryByText("Total de Embalagens")).not.toBeInTheDocument();
    });

    it("deve ocultar o campo Parte no modo Ponto a Ponto", async () => {
      expect(screen.queryByText("Parte")).not.toBeInTheDocument();
    });

    it("deve configurar o DatePicker para o modo mensal", async () => {
      const dateInput = screen.getByTestId("data_programada_0");
      expect(dateInput).toHaveAttribute("data-monthly", "true");
    });

    it("deve habilitar o botão de adicionar etapa mesmo sem campos de empenho", async () => {
      const botao = screen.getByTestId("adicionar-etapa");
      expect(botao).not.toBeDisabled();
    });
  });
});
