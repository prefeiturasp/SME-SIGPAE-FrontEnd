import React from "react";
import {
  render,
  screen,
  act,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import mock from "src/services/_mock";
import ConferenciaGuiaRemessaComOcorrencia from "..";
import { mockGuiaParaConferencia } from "../../../../../mocks/logistica.service/mockGetGuiaParaConferencia";

// Configuração inicial dos mocks da API
beforeEach(() => {
  mock
    .onGet(`/guias-da-requisicao/guia-para-conferencia/`)
    .reply(200, mockGuiaParaConferencia);

  // Limpa o localStorage antes de cada teste
  localStorage.clear();
});

// Função de setup para renderizar o componente
const setup = async (params = {}) => {
  const search = `?uuid=${mockGuiaParaConferencia.uuid}${
    params.autofill ? "&autofill=true" : ""
  }${params.editar ? "&editar=true" : ""}`;
  localStorage.setItem(
    "alimentosConferencia",
    JSON.stringify(["COXAO DURO", "CONTRA FILE"])
  );

  Object.defineProperty(window, "location", {
    value: {
      search: search,
    },
    writable: true,
  });

  await act(async () => {
    render(
      <MemoryRouter>
        <ConferenciaGuiaRemessaComOcorrencia />
      </MemoryRouter>
    );
  });
};

// Helper para preencher inputs
const preencheInput = (testId, value) => {
  const input = screen.getByTestId(testId);
  fireEvent.change(input, { target: { value } });
};

describe("Conferência de Guia com Ocorrência", () => {
  it("renderiza corretamente no modo normal", async () => {
    await setup();

    // Verifica elementos básicos
    expect(
      screen.getByText("Conferência individual dos itens")
    ).toBeInTheDocument();
    expect(screen.getByText("Nº da Guia de Remessa")).toBeInTheDocument();
    expect(screen.getByText("Data de Entrega Prevista")).toBeInTheDocument();
    expect(
      screen.getByText("Selecionar Data de Recebimento da UE")
    ).toBeInTheDocument();
    expect(screen.getByText("Finalizar Conferência")).toBeInTheDocument();
    expect(screen.getByText("Cancelar")).toBeInTheDocument();
  });

  it("permite preencher e submeter o formulário completo", async () => {
    await setup();

    // Preenche campos gerais
    const divDia = screen.getByTestId("data_entrega_real");
    const inputData = divDia.querySelector("input");
    fireEvent.change(inputData, { target: { value: "24/04/2025" } });

    const inputHora = screen.getByPlaceholderText("Selecione a Hora");
    fireEvent.mouseDown(inputHora);
    fireEvent.change(inputHora, { target: { value: "14:16" } });
    fireEvent.click(screen.getByText("OK"));

    preencheInput("nome_motorista", "Josenildo");
    preencheInput("placa_veiculo", "ABC1234");

    // Preenche campos específicos de alimentos
    preencheInput("recebidos_fechada_0", "50");
    preencheInput("recebidos_fracionada_0", "50");
    preencheInput("observacoes_0", "Observação para o alimento 1");

    // Para o segundo alimento, se existir
    if (screen.queryByTestId("recebidos_fechada_1")) {
      preencheInput("recebidos_fechada_1", "50");
      preencheInput("observacoes_1", "Observação para o alimento 2");
    }

    // Submete o formulário
    const btnFinalizar = screen
      .getByText("Finalizar Conferência")
      .closest("button");
    expect(btnFinalizar).not.toBeDisabled();
    fireEvent.click(btnFinalizar);

    // Verifica se os dados foram salvos no localStorage real
    await waitFor(() => {
      const valoresConferencia = JSON.parse(
        localStorage.getItem("valoresConferencia")
      );
      const guiaConferencia = JSON.parse(
        localStorage.getItem("guiaConferencia")
      );

      expect(valoresConferencia).toBeInstanceOf(Array);
      expect(guiaConferencia).toBeDefined();
      expect(valoresConferencia[0].nome_motorista).toBe("Josenildo");
      expect(valoresConferencia[0].placa_veiculo).toBe("ABC1234");
    });
  });

  it("mostra mensagem de erro quando data é posterior à prevista", async () => {
    await setup();

    // Configura data posterior à prevista
    const divDia = screen.getByTestId("data_entrega_real");
    const inputData = divDia.querySelector("input");
    fireEvent.change(inputData, { target: { value: "24/04/2030" } });

    // Verifica mensagem de informação
    await waitFor(() => {
      expect(
        screen.getByText("Data posterior à prevista na guia!")
      ).toBeInTheDocument();
    });
  });

  it("habilita campos condicionalmente baseado no status", async () => {
    await setup();

    // Preenche campos para disparar cálculo de status
    const divDia = screen.getByTestId("data_entrega_real");
    const inputData = divDia.querySelector("input");
    fireEvent.change(inputData, { target: { value: "24/04/2025" } });

    // Força status "Não Recebido" (quantidade = 0)
    preencheInput("recebidos_fechada_0", "0");

    // Verifica se campos dependentes foram habilitados
    await waitFor(() => {
      const inputObservacoes = screen.getByTestId("observacoes_0");

      expect(inputObservacoes).not.toBeDisabled();
    });
  });

  it("carrega dados do localStorage quando autofill é ativado", async () => {
    // Configura dados no localStorage real
    const mockValoresConferencia = [
      {
        recebidos_fechada: "10",
        recebidos_fracionada: "5",
        status: "Parcial",
        ocorrencias: ["ATRASO_ENTREGA"],
        observacoes: "Observação teste",
        arquivo: null,
        data_entrega: "24/04/2025",
        nome_motorista: "Motorista Teste",
        placa_veiculo: "ABC1234",
        hora_recebimento: "12:30:00",
        data_entrega_real: "24/04/2025",
        uuid_conferencia: "uuid-teste",
      },
    ];

    localStorage.setItem(
      "valoresConferencia",
      JSON.stringify(mockValoresConferencia)
    );
    localStorage.setItem(
      "guiaConferencia",
      JSON.stringify(mockGuiaParaConferencia)
    );

    await setup({ autofill: true });

    // Verifica se os dados foram carregados corretamente
    await waitFor(() => {
      expect(screen.getByDisplayValue("Motorista Teste")).toBeInTheDocument();
      expect(screen.getByDisplayValue("ABC1234")).toBeInTheDocument();
      expect(screen.getAllByDisplayValue("Parcial")[0]).toBeInTheDocument();
    });
  });

  it("mostra corretamente os cards de alimentos com status de erro", async () => {
    await setup();

    const divDia = screen.getByTestId("data_entrega_real");
    const inputData = divDia.querySelector("input");
    fireEvent.change(inputData, { target: { value: "24/04/2025" } });

    preencheInput("recebidos_fechada_0", "");

    await waitFor(() => {
      // Correção alternativa usando classes CSS
      const cardHeaders = document.querySelectorAll(".card-header");
      const primeiroCardHeader = cardHeaders[0];
      expect(primeiroCardHeader).toHaveClass("card-tipo-red");
    });
  });
});
